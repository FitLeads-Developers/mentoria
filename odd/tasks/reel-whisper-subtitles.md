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
- [ ] T1 Transcription script + `/mentoria:instalar` installs whisper.cpp and a model inside `~/mentoria/reels`; `/mentoria:reel` transcribes, shows transcript for correction, writes SRT + captions JSON, burns subtitles with Remotion; standalone "solo transcribir" path. Plugin 0.5.0. Route: delegated writer (2+ non-trivial files).

## Progress / evidence
- (none yet)

## Next step
T1.
