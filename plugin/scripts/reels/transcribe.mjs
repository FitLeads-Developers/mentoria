#!/usr/bin/env node
// Local, free transcription with whisper.cpp through Remotion's official packages.
// Run it from inside ~/mentoria/reels (the folder where the packages are installed):
//   node scripts/transcribe.mjs <video> [--model small] [--out <dir>] [--force]
//   node scripts/transcribe.mjs --setup [--model small]   (install or repair whisper.cpp and the model; safe to repeat)
// Without --setup it never installs or downloads anything. It refuses to overwrite existing
// outputs (the student may have corrected them) unless --force is given.
import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, mkdtempSync, rmSync, statSync, writeFileSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { downloadWhisperModel, installWhisperCpp, toCaptions, transcribe } from '@remotion/install-whisper-cpp';
import { serializeSrt } from '@remotion/captions';
import {
  buildOutputPaths,
  findExistingOutputs,
  groupWordsIntoLines,
  isModelComplete,
  mergeTokensIntoWords,
  parseArgs,
  whisperPaths,
  wordsToTranscript,
} from './captions.mjs';

// 1.5.5 is the version Remotion documents; on Windows it ships as a prebuilt binary.
const WHISPER_CPP_VERSION = '1.5.5';
const LANGUAGE = 'es';
const WHISPER_DIR = path.join(process.cwd(), 'whisper.cpp');

function isReady(model) {
  const paths = whisperPaths(WHISPER_DIR, WHISPER_CPP_VERSION, model);
  return existsSync(paths.binary) && existsSync(paths.model) && isModelComplete(model, statSync(paths.model).size);
}

// Install or repair: reuses whatever is already there and verifies both pieces at the end.
async function setupWhisper(model) {
  const paths = whisperPaths(WHISPER_DIR, WHISPER_CPP_VERSION, model);
  if (existsSync(WHISPER_DIR) && !existsSync(paths.binary)) {
    throw new Error(`La carpeta ${WHISPER_DIR} está a medias (falta el programa). Bórrala y vuelve a ejecutar la instalación.`);
  }
  const { alreadyExisted } = await installWhisperCpp({ version: WHISPER_CPP_VERSION, to: WHISPER_DIR });
  if (alreadyExisted) console.log('whisper.cpp ya estaba instalado: lo reutilizo.');
  if (existsSync(paths.model) && !isModelComplete(model, statSync(paths.model).size)) {
    console.log(`El modelo ${model} está incompleto: lo descargo de nuevo.`);
    rmSync(paths.model);
  }
  const downloaded = await downloadWhisperModel({ model, folder: WHISPER_DIR });
  if (downloaded.alreadyExisted) console.log(`Modelo ${model} ya descargado: lo reutilizo.`);
  if (!isReady(model)) {
    throw new Error(`La instalación no ha quedado completa (programa o modelo ${model}). Repite la instalación.`);
  }
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
  if (args.setup) {
    await setupWhisper(args.model);
    console.log(`Listo: whisper.cpp y el modelo ${args.model} instalados en ${WHISPER_DIR}`);
    return;
  }
  if (!isReady(args.model)) {
    throw new Error(
      `Whisper o el modelo ${args.model} no están instalados. Ejecuta /mentoria:instalar (paso de Whisper) y vuelve a probar.`,
    );
  }

  const video = path.resolve(args.video);
  if (!existsSync(video)) throw new Error(`No encuentro el vídeo: ${video}`);
  const out = buildOutputPaths(video, args.out && path.resolve(args.out));
  const existing = findExistingOutputs(out, existsSync);
  if (existing.length > 0 && !args.force) {
    throw new Error(
      `Ya existen estos archivos (puede que los hayas corregido):\n  ${existing.join('\n  ')}\n` +
        'No los toco. Si de verdad quieres rehacerlos y perder esas correcciones, repite con --force.',
    );
  }
  mkdirSync(path.dirname(out.srt), { recursive: true });

  // The temporary WAV lives in the system temp folder, never next to the video (Drive, OneDrive, read-only).
  const tmpDir = mkdtempSync(path.join(os.tmpdir(), 'fitleads-whisper-'));
  try {
    const wav = path.join(tmpDir, 'audio.wav');
    console.log('Preparando el audio...');
    toWav16kMono(video, wav);
    console.log('Transcribiendo (puede tardar unos minutos)...');
    const whisperOutput = await transcribe({
      inputPath: wav,
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
    rmSync(tmpDir, { recursive: true, force: true });
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
