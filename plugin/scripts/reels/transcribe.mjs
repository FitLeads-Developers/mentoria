#!/usr/bin/env node
// Local, free transcription with whisper.cpp through Remotion's official packages.
// Run it from inside ~/mentoria/reels (the folder where the packages are installed):
//   node scripts/transcribe.mjs <video> [--model small] [--out <dir>]
//   node scripts/transcribe.mjs --setup [--model small]   (one-time install of whisper.cpp and the model)
import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { downloadWhisperModel, installWhisperCpp, toCaptions, transcribe } from '@remotion/install-whisper-cpp';
import { serializeSrt } from '@remotion/captions';
import { buildOutputPaths, groupWordsIntoLines, mergeTokensIntoWords, parseArgs, wordsToTranscript } from './captions.mjs';

// 1.5.5 is the version Remotion documents; on Windows it ships as a prebuilt binary.
const WHISPER_CPP_VERSION = '1.5.5';
const LANGUAGE = 'es';
const WHISPER_DIR = path.join(process.cwd(), 'whisper.cpp');

async function ensureWhisper(model) {
  const { alreadyExisted } = await installWhisperCpp({ version: WHISPER_CPP_VERSION, to: WHISPER_DIR });
  if (alreadyExisted) console.log('whisper.cpp ya estaba instalado: lo reutilizo.');
  const downloaded = await downloadWhisperModel({ model, folder: WHISPER_DIR });
  if (downloaded.alreadyExisted) console.log(`Modelo ${model} ya descargado: lo reutilizo.`);
}

// Remotion bundles its own ffmpeg, so the student needs no system ffmpeg.
function toWav16kMono(input, output) {
  const isWin = process.platform === 'win32';
  const quote = (p) => (isWin ? `"${p}"` : p);
  execFileSync(
    isWin ? 'npx.cmd' : 'npx',
    ['remotion', 'ffmpeg', '-y', '-i', quote(input), '-ar', '16000', '-ac', '1', quote(output)],
    { stdio: ['ignore', 'ignore', 'inherit'], shell: isWin },
  );
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  await ensureWhisper(args.model);
  if (args.setup) {
    console.log(`Listo: whisper.cpp y el modelo ${args.model} instalados en ${WHISPER_DIR}`);
    return;
  }

  const video = path.resolve(args.video);
  if (!existsSync(video)) throw new Error(`No encuentro el vídeo: ${video}`);
  const out = buildOutputPaths(video, args.out && path.resolve(args.out));
  mkdirSync(path.dirname(out.srt), { recursive: true });

  try {
    console.log('Preparando el audio...');
    toWav16kMono(video, out.wav);
    console.log('Transcribiendo (puede tardar unos minutos)...');
    const whisperOutput = await transcribe({
      inputPath: out.wav,
      whisperPath: WHISPER_DIR,
      whisperCppVersion: WHISPER_CPP_VERSION,
      model: args.model,
      modelFolder: WHISPER_DIR,
      language: LANGUAGE,
      tokenLevelTimestamps: true,
      printOutput: false,
    });
    const { captions: tokens } = toCaptions({ whisperCppOutput: whisperOutput });
    const words = mergeTokensIntoWords(tokens);
    writeFileSync(out.captionsJson, JSON.stringify(words, null, 2));
    writeFileSync(out.srt, serializeSrt({ lines: groupWordsIntoLines(words) }));
    writeFileSync(out.txt, wordsToTranscript(words));
  } finally {
    rmSync(out.wav, { force: true });
  }

  console.log('Hecho. Archivos:');
  console.log(`  Texto:     ${out.txt}`);
  console.log(`  Subtítulos: ${out.srt}`);
  console.log(`  Palabras con tiempos (para Remotion): ${out.captionsJson}`);
}

main().catch((error) => {
  console.error(`Error: ${error.message}`);
  process.exit(1);
});
