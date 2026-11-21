import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  mergeTokensIntoWords,
  groupWordsIntoLines,
  wordsToTranscript,
  buildOutputPaths,
  parseArgs,
  DEFAULT_MODEL,
} from './captions.mjs';

const tok = (text, startMs, endMs) => ({
  text,
  startMs,
  endMs,
  timestampMs: startMs,
  confidence: 0.9,
});

const word = (text, startMs, endMs) => tok(text, startMs, endMs);

test('mergeTokensIntoWords joins sub-word tokens into one word', () => {
  const words = mergeTokensIntoWords([
    tok('Ho', 0, 200),
    tok('la', 200, 400),
    tok(' mun', 400, 600),
    tok('do', 600, 900),
  ]);
  assert.deepEqual(
    words.map((w) => [w.text, w.startMs, w.endMs]),
    [
      ['Hola', 0, 400],
      [' mundo', 400, 900],
    ],
  );
});

test('mergeTokensIntoWords attaches punctuation to the previous word', () => {
  const words = mergeTokensIntoWords([tok('Hola', 0, 300), tok(',', 300, 320), tok(' qué', 400, 600), tok('?', 600, 620)]);
  assert.deepEqual(words.map((w) => w.text), ['Hola,', ' qué?']);
  assert.equal(words[0].endMs, 320);
});

test('mergeTokensIntoWords drops whisper special tokens', () => {
  const words = mergeTokensIntoWords([
    tok('[_BEG_]', 0, 0),
    tok('Hola', 0, 300),
    tok(' [BLANK_AUDIO]', 300, 900),
    tok('[_TT_150]', 900, 900),
  ]);
  assert.deepEqual(words.map((w) => w.text), ['Hola']);
});

test('mergeTokensIntoWords keeps the confidence of the lowest token', () => {
  const words = mergeTokensIntoWords([
    { ...tok('Ho', 0, 100), confidence: 0.9 },
    { ...tok('la', 100, 200), confidence: 0.4 },
  ]);
  assert.equal(words[0].confidence, 0.4);
});

test('mergeTokensIntoWords on empty input returns an empty list', () => {
  assert.deepEqual(mergeTokensIntoWords([]), []);
});

test('groupWordsIntoLines limits words per line', () => {
  const words = ['a', ' b', ' c', ' d', ' e'].map((t, i) => word(t, i * 100, i * 100 + 90));
  const lines = groupWordsIntoLines(words, { maxWords: 3, maxChars: 25 });
  assert.deepEqual(lines.map((l) => l.length), [3, 2]);
});

test('groupWordsIntoLines limits characters per line', () => {
  const words = ['entrenamiento', ' personalizado', ' funcional'].map((t, i) => word(t, i * 100, i * 100 + 90));
  const lines = groupWordsIntoLines(words, { maxWords: 4, maxChars: 25 });
  assert.deepEqual(lines.map((l) => l.map((w) => w.text.trim()).join(' ')), [
    'entrenamiento',
    'personalizado funcional',
  ]);
});

test('groupWordsIntoLines breaks after sentence-ending punctuation', () => {
  const words = ['Hola.', ' Soy', ' Ana'].map((t, i) => word(t, i * 100, i * 100 + 90));
  const lines = groupWordsIntoLines(words, { maxWords: 4, maxChars: 25 });
  assert.equal(lines.length, 2);
  assert.equal(lines[0].length, 1);
});

test('groupWordsIntoLines keeps an overlong single word on its own line', () => {
  const words = [word('electroencefalografistas', 0, 100)];
  const lines = groupWordsIntoLines(words, { maxWords: 3, maxChars: 10 });
  assert.equal(lines.length, 1);
});

test('groupWordsIntoLines uses defaults for vertical video', () => {
  const words = Array.from({ length: 8 }, (_, i) => word(i === 0 ? 'uno' : ' uno', i * 100, i * 100 + 90));
  const lines = groupWordsIntoLines(words);
  assert.ok(lines.every((l) => l.length <= 4));
});

test('wordsToTranscript puts one sentence per line', () => {
  const words = ['Hola.', ' Soy', ' Ana.', ' ¿Qué', ' tal?'].map((t, i) => word(t, i, i + 1));
  assert.equal(wordsToTranscript(words), 'Hola.\nSoy Ana.\n¿Qué tal?\n');
});

test('wordsToTranscript of no words is an empty string', () => {
  assert.equal(wordsToTranscript([]), '');
});

test('buildOutputPaths puts outputs next to the video by default', () => {
  const p = buildOutputPaths('/v/reel sentadillas.mp4');
  assert.equal(p.captionsJson, '/v/reel sentadillas.captions.json');
  assert.equal(p.srt, '/v/reel sentadillas.srt');
  assert.equal(p.txt, '/v/reel sentadillas.txt');
  assert.equal(p.wav, '/v/reel sentadillas.16k.wav');
});

test('buildOutputPaths honours an output directory', () => {
  const p = buildOutputPaths('/v/clip.mov', '/out');
  assert.equal(p.srt, '/out/clip.srt');
  assert.equal(p.captionsJson, '/out/clip.captions.json');
});

test('parseArgs reads video, model and out', () => {
  assert.deepEqual(parseArgs(['clip.mp4', '--model', 'medium', '--out', 'o']), {
    setup: false,
    video: 'clip.mp4',
    model: 'medium',
    out: 'o',
  });
});

test('parseArgs defaults to the multilingual default model', () => {
  const a = parseArgs(['clip.mp4']);
  assert.equal(a.model, DEFAULT_MODEL);
  assert.equal(a.out, undefined);
});

test('parseArgs rejects English-only models', () => {
  assert.throws(() => parseArgs(['clip.mp4', '--model', 'small.en']), /multiling/i);
});

test('parseArgs rejects unknown models', () => {
  assert.throws(() => parseArgs(['clip.mp4', '--model', 'gigante']), /modelo/i);
});

test('parseArgs requires a video', () => {
  assert.throws(() => parseArgs([]), /vídeo/i);
});

test('parseArgs rejects a flag without value', () => {
  assert.throws(() => parseArgs(['clip.mp4', '--model']), /--model/);
});

test('parseArgs --setup does not need a video', () => {
  const a = parseArgs(['--setup', '--model', 'medium']);
  assert.equal(a.setup, true);
  assert.equal(a.video, undefined);
  assert.equal(a.model, 'medium');
});

test('parseArgs defaults setup to false', () => {
  assert.equal(parseArgs(['clip.mp4']).setup, false);
});

test('mergeTokensIntoWords attaches Spanish opening marks to the next word', () => {
  const words = mergeTokensIntoWords([tok('Anna', 0, 300), tok('!', 300, 320), tok(' ¡', 320, 330), tok('Oi', 330, 500), tok('go', 500, 600)]);
  assert.deepEqual(words.map((w) => w.text), ['Anna!', ' ¡Oigo']);
  assert.equal(words[1].startMs, 320);
});

test('groupWordsIntoLines strips the leading space of each line', () => {
  const words = ['uno', ' dos', ' tres', ' cuatro', ' cinco'].map((t, i) => word(t, i * 100, i * 100 + 90));
  const lines = groupWordsIntoLines(words, { maxWords: 3 });
  assert.equal(lines[1][0].text, 'cuatro');
  assert.equal(lines[1][1].text, ' cinco');
});

test('groupWordsIntoLines does not mutate its input', () => {
  const words = ['uno', ' dos'].map((t, i) => word(t, i * 100, i * 100 + 90));
  groupWordsIntoLines(words, { maxWords: 1 });
  assert.equal(words[1].text, ' dos');
});
