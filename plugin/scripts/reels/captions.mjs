// Pure helpers for transcribe.mjs. No I/O and no dependencies, so they are easy to test.
import path from 'node:path';

export const DEFAULT_MODEL = 'small';
// Multilingual models only: the `.en` variants cannot transcribe Spanish.
// large-v3-turbo is left out on purpose: it postdates whisper.cpp 1.5.5, the pinned version.
export const MODELS = ['tiny', 'base', 'small', 'medium'];
// Exact sizes in bytes from @remotion/install-whisper-cpp, to detect interrupted downloads.
const MODEL_SIZES = { tiny: 77691713, base: 147951465, small: 487601967, medium: 1533763059 };

const SPECIAL_TOKEN = /^\s*\[[^\]]*\]\s*$/; // [_BEG_], [_TT_150], [BLANK_AUDIO]
const OPENING_ONLY = /^\s*[¡¿(«\[]+$/;
const PUNCTUATION_ONLY = /^[\s.,;:!?…)\]»"'-]+$/;
const SENTENCE_END = /[.!?…]["')»]*$/;

/**
 * Whisper emits sub-word tokens ("Ho", "la"). A token that starts with a space
 * begins a new word; closing punctuation sticks to the previous word and opening
 * marks (¡ ¿ " ( «) stick to the next one.
 * Output keeps the Caption shape of @remotion/captions: later words keep their
 * leading space, which createTikTokStyleCaptions() relies on.
 */
export function mergeTokensIntoWords(tokens) {
  const words = [];
  let opening = null; // pending opening mark waiting for its word
  for (const token of tokens) {
    if (SPECIAL_TOKEN.test(token.text) || token.text.trim() === '') continue;
    if (OPENING_ONLY.test(token.text)) {
      opening = opening ? { ...opening, text: opening.text + token.text.trim() } : token;
      continue;
    }
    const last = words[words.length - 1];
    const startsWord = /^\s/.test(token.text) || opening !== null;
    if (last && (!startsWord || PUNCTUATION_ONLY.test(token.text))) {
      last.text += token.text;
      last.endMs = token.endMs;
      last.confidence = minConfidence(last.confidence, token.confidence);
    } else if (opening) {
      words.push({ ...token, text: opening.text + token.text.trimStart(), startMs: opening.startMs });
    } else {
      words.push({ ...token, text: words.length === 0 ? token.text.trimStart() : token.text });
    }
    opening = null;
  }
  return words;
}

function minConfidence(a, b) {
  if (a === null || b === null) return a ?? b;
  return Math.min(a, b);
}

/** Groups words into short lines for vertical video (default: up to 4 words and 25 characters). */
export function groupWordsIntoLines(words, { maxWords = 4, maxChars = 25 } = {}) {
  const lines = [];
  let current = [];
  let chars = 0;
  for (const word of words) {
    const length = word.text.trim().length + (current.length > 0 ? 1 : 0);
    if (current.length > 0 && (current.length >= maxWords || chars + length > maxChars)) {
      lines.push(current);
      current = [];
      chars = 0;
    }
    current.push(word);
    chars += word.text.trim().length + (current.length > 1 ? 1 : 0);
    if (SENTENCE_END.test(word.text.trim())) {
      lines.push(current);
      current = [];
      chars = 0;
    }
  }
  if (current.length > 0) lines.push(current);
  return lines.map(trimLineStart);
}

function trimLineStart(line) {
  const [first, ...rest] = line;
  return [{ ...first, text: first.text.trimStart() }, ...rest];
}

/** Plain transcript, one sentence per line. */
export function wordsToTranscript(words) {
  const sentences = [];
  let current = [];
  for (const word of words) {
    current.push(word.text.trim());
    if (SENTENCE_END.test(word.text.trim())) {
      sentences.push(current.join(' '));
      current = [];
    }
  }
  if (current.length > 0) sentences.push(current.join(' '));
  return sentences.length > 0 ? sentences.join('\n') + '\n' : '';
}

/** Output file names: next to the video unless an output directory is given. */
export function buildOutputPaths(videoPath, outDir) {
  const { dir, name } = path.parse(videoPath);
  const base = path.join(outDir ?? dir, name);
  return {
    captionsJson: `${base}.captions.json`,
    srt: `${base}.srt`,
    txt: `${base}.txt`,
  };
}

/** Outputs that already exist, so a re-run cannot silently overwrite the student's corrections. */
export function findExistingOutputs(paths, exists) {
  return Object.values(paths).filter((file) => exists(file));
}

/** Where whisper.cpp keeps its binary and a model, mirroring @remotion/install-whisper-cpp. */
export function whisperPaths(dir, version, model, platform = process.platform) {
  const modern = compareVersions(version, '1.7.4') >= 0;
  const folder = modern ? ['build', 'bin'] : [];
  const exe = `${modern ? 'whisper-cli' : 'main'}${platform === 'win32' ? '.exe' : ''}`;
  return { binary: path.join(dir, ...folder, exe), model: path.join(dir, `ggml-${model}.bin`) };
}

function compareVersions(a, b) {
  const pa = a.split('.').map(Number);
  const pb = b.split('.').map(Number);
  for (let i = 0; i < 3; i++) {
    const diff = (pa[i] ?? 0) - (pb[i] ?? 0);
    if (diff !== 0) return diff;
  }
  return 0;
}

export function isModelComplete(model, sizeBytes) {
  return model in MODEL_SIZES && sizeBytes >= MODEL_SIZES[model];
}

/** CLI: node transcribe.mjs <video> [--model small] [--out <dir>] [--force]  |  node transcribe.mjs --setup [--model small] */
export function parseArgs(argv) {
  const args = { video: undefined, model: DEFAULT_MODEL, out: undefined, setup: false, force: false };
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === '--setup') {
      args.setup = true;
    } else if (arg === '--force') {
      args.force = true;
    } else if (arg === '--model' || arg === '--out') {
      const value = argv[++i];
      if (value === undefined || value.startsWith('--')) throw new Error(`Falta el valor de ${arg}`);
      args[arg.slice(2)] = value;
    } else if (arg.startsWith('--')) {
      throw new Error(`Opción desconocida: ${arg}`);
    } else if (args.video === undefined) {
      args.video = arg;
    } else {
      throw new Error(`Sobra el argumento: ${arg}`);
    }
  }
  if (args.video === undefined && !args.setup) throw new Error('Falta la ruta del vídeo');
  if (args.model.endsWith('.en')) {
    throw new Error(`El modelo ${args.model} es solo para inglés. Usa un modelo multilingüe: ${MODELS.join(', ')}`);
  }
  if (!MODELS.includes(args.model)) {
    throw new Error(`Modelo desconocido: ${args.model}. Modelos válidos: ${MODELS.join(', ')}`);
  }
  return args;
}
