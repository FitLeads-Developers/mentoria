# Feature: WhatsApp QR on any OS + Academia task

## Objective
Students of the FitLeads course run `/mentoria:whatsapp` on macOS, Windows or Linux. The QR page opens in the system default browser (not Claude's browser). The Academia gets a task telling students to use `/mentoria:whatsapp`, with clear safety guidance.

## Problem / why
- `skills/whatsapp/SKILL.md` opens the QR with `open http://127.0.0.1:3977` (macOS only) and only documents the macOS Chrome path for the Puppeteer fallback.
- Students use Windows and Linux too.
- Students need reassurance: reading is safe; sending (especially bulk sends) risks a ban.

## Scope
- Plugin repo `FitLeads-Developers/mentoria` (local `curso-ia-entrenadores/plugin-fitleads`), branch `feat/whatsapp-qr-cross-os`.
- Academia (CourseLit, membership course) task complement about WhatsApp. Publishing to production requires user approval of the text first.

## Constraints
- The reader stays read-only; no send code.
- Server still binds only to 127.0.0.1.
- Push only via the FitLeads-Developers account; push/PR is the user's decision.
- TDD: on (global Strict TDD). Runner: `npm test` (`node --test`) in `plugin/scripts/whatsapp`, wrapped in `~/.claude/bin/testsem`.

## Tasks
- [x] T1 Server opens the QR page in the system default browser on darwin/win32/linux (`--no-open` to skip); system Chrome/Chromium auto-detection per OS as Puppeteer fallback; skill updated for all OSes; plugin version bump. Route: delegated writer (2+ non-trivial files).
- [ ] T2 Academia task text drafted (read is safe; avoid sends; never bulk sends) and approved by user. Route: inline.
- [ ] T4 Skill becomes a live read-only connector: installs for the student, connects via QR, answers questions by reading chats through new GET endpoints; export + RGPD consent check removed (user 2026-11-20). Route: delegated writer.
- [ ] T3 Publish the approved task on CourseLit (Lección 5 WhatsApp complement). Route: inline, after explicit approval.

## Acceptance
- Unit tests cover the open-command choice per platform and Chrome candidate detection.
- `npm test` green.
- SKILL.md has no macOS-only command left.

## Progress / evidence
- T1 cd5540b: browser.js (openCommand/chromeCandidates/findChrome/isLaunchFailure) + 12 tests; server opens system browser after listen, --no-open, one retry with system Chrome; SKILL.md cross-OS + safety warning; plugin 0.3.0. RED 11/12 (missing module) -> GREEN 23/23 (writer), parent re-run 23/23. Real WhatsApp run not exercised (no server start against WhatsApp); Windows/Linux not run on real machines. RDD disabled (rdd_disabled) -> assess high -> independent reviewer: 0 blockers, 3 minor; fixed windowsHide + non-zero exit hint in 9ad6d89 (23/23); deferred: extra Chrome candidates (~/Applications, Brave, /snap/bin).

## Next step
T4 (writer), then T2 approval, push decision, T3.
