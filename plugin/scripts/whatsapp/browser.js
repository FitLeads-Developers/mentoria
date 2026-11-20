// Pure helpers for opening the QR page and locating a system Chrome.
// Everything takes platform/env/existsFn as parameters so it can be unit-tested.
import { existsSync } from 'node:fs';
import path from 'node:path';

// Command that opens `url` in the system default browser, or null if unsupported.
export function openCommand(platform, url) {
  switch (platform) {
    case 'darwin':
      return { cmd: 'open', args: [url] };
    case 'win32':
      // The empty "" is the window title that `start` expects before the target.
      return { cmd: 'cmd', args: ['/c', 'start', '""', url] };
    case 'linux':
      return { cmd: 'xdg-open', args: [url] };
    default:
      return null;
  }
}

const LINUX_BINARIES = [
  'google-chrome',
  'google-chrome-stable',
  'chromium',
  'chromium-browser',
  'microsoft-edge',
];

// Ordered list of places where a Chrome/Chromium/Edge executable may live.
export function chromeCandidates(platform, env = {}) {
  if (platform === 'darwin') {
    return [
      '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
      '/Applications/Chromium.app/Contents/MacOS/Chromium',
      '/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge',
    ];
  }
  if (platform === 'win32') {
    const roots = [env.ProgramFiles, env['ProgramFiles(x86)'], env.LOCALAPPDATA].filter(Boolean);
    const rels = [
      ['Google', 'Chrome', 'Application', 'chrome.exe'],
      ['Microsoft', 'Edge', 'Application', 'msedge.exe'],
    ];
    return rels.flatMap((rel) => roots.map((root) => path.win32.join(root, ...rel)));
  }
  if (platform === 'linux') {
    const dirs = [...(env.PATH ?? '').split(':').filter(Boolean), '/usr/bin'];
    const unique = [...new Set(dirs)];
    return LINUX_BINARIES.flatMap((bin) => unique.map((dir) => path.posix.join(dir, bin)));
  }
  return [];
}

export function findChrome(platform, env, exists = existsSync) {
  return chromeCandidates(platform, env).find((p) => exists(p)) ?? null;
}

// True when puppeteer failed because no usable browser binary was found.
export function isLaunchFailure(err) {
  return /Failed to launch the browser|Could not find (Chrome|Chromium|browser)/i.test(String(err?.message ?? err));
}
