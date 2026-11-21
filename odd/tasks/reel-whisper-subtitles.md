# Feature: local Whisper transcription and subtitles for reels

## Objective
Students ask Claude to transcribe their recorded video and add subtitles. It works offline on macOS, Windows and Linux, with no API key.

## Problem / why
`skills/reel/SKILL.md` says "transcribe el audio" but no tool is installed. `/mentoria:instalar` only installs Remotion.

## Approach
Use Remotion's official `@remotion/install-whisper-cpp` (installs whisper.cpp + model locally, token-level timestamps) and `@remotion/captions` for the caption format; convert audio to 16 kHz WAV with `npx remotion ffmpeg` (no system ffmpeg needed).

## Scope / constraints
- Plugin repo FitLeads-Developers/mentoria, branch `feat/reel-whisper-subtitles`; push via FitLeads-Developers after user OK.
- Student-facing copy in Spanish (tú). Code in English.
- TDD on (global). Runner: `node --test` for any pure helper.

## Tasks
- [x] T1 Transcription script + `/mentoria:instalar` installs whisper.cpp and a model inside `~/mentoria/reels`; `/mentoria:reel` transcribes, shows transcript for correction, writes SRT + captions JSON, burns subtitles with Remotion; standalone "solo transcribir" path. Plugin 0.5.0. Route: delegated writer (2+ non-trivial files).

## Progress / evidence
- T1 done (delegated writer). Commits: 1a94850 (script + tests), 2b7d98d (skills, README, plugin 0.5.0).
- TDD (node --test via testsem, `plugin/scripts/reels`): RED = module missing, 0 tests ran; then 20/20 GREEN; extended twice (setup flag: 3 RED -> 22/22; opening marks and line trim: 2 RED -> 25/25).
- `node --check` ok on captions.mjs and transcribe.mjs; `claude plugin validate .` passed.
- Verified APIs (remotion 4.0.545 .d.ts + remotion.dev docs): installWhisperCpp({version,to}), downloadWhisperModel({model,folder}), transcribe({inputPath,whisperPath,whisperCppVersion,model,modelFolder,language,tokenLevelTimestamps}), toCaptions({whisperCppOutput}), @remotion/captions Caption, serializeSrt({lines}), createTikTokStyleCaptions; `npx remotion ffmpeg` exists (ffmpeg n7.1).
- Real e2e on macOS (scratch, tiny model, generated Spanish speech with `say`): whisper.cpp 1.5.5 built in ~45 s, tiny model downloaded, wav conversion, .txt/.srt/.captions.json written. Not run: small/medium model, Windows, Linux, the skills driven by Claude, Remotion animated render.
- Decisions: whisper.cpp 1.5.5 (version in Remotion docs; Windows prebuilt binary), default model `small` (about 470 MB, acceptable Spanish on CPU), `--model medium` optional; `--setup` flag installs whisper and the model; scripts are .mjs so they work inside the reels project regardless of its package type; packages pinned to the project's remotion version at install time.

- Review correction (8 findings): `--setup` now repairs and verifies binary and model and always runs; transcribe never installs; outputs are protected unless `--force`; WAV goes to an `os.tmpdir()` mkdtemp dir removed in `finally`; `large-v3-turbo` dropped (accepted by the 4.0.545 .d.ts but postdates whisper.cpp 1.5.5); skills always copy scripts, guard on the script, and every command matches allowed-tools. TDD: RED (import failure) then 34/34 GREEN. e2e (tiny, scratch): first run ok, rerun refused, `--force` ok, missing model gives the /mentoria:instalar message, `--setup` reuses. Commits: see git log (fix(reels) and fix(mentoria)).

## Route
Delegated writer (2+ non-trivial files).

## Next step
User review, then push via FitLeads-Developers.
