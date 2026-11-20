import { test } from 'node:test';
import assert from 'node:assert/strict';
import { openCommand, chromeCandidates, findChrome, isLaunchFailure } from './browser.js';

const URL = 'http://127.0.0.1:3977';

test('openCommand uses "open" on macOS', () => {
  assert.deepEqual(openCommand('darwin', URL), { cmd: 'open', args: [URL] });
});

test('openCommand uses cmd /c start with an empty title on Windows', () => {
  assert.deepEqual(openCommand('win32', URL), { cmd: 'cmd', args: ['/c', 'start', '""', URL] });
});

test('openCommand uses xdg-open on Linux', () => {
  assert.deepEqual(openCommand('linux', URL), { cmd: 'xdg-open', args: [URL] });
});

test('openCommand returns null on an unknown platform', () => {
  assert.equal(openCommand('plan9', URL), null);
});

test('chromeCandidates on macOS lists Chrome, Chromium and Edge apps', () => {
  const c = chromeCandidates('darwin', {});
  assert.ok(c.includes('/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'));
  assert.ok(c.includes('/Applications/Chromium.app/Contents/MacOS/Chromium'));
  assert.ok(c.includes('/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge'));
});

test('chromeCandidates on Windows uses the Program Files and LocalAppData env vars', () => {
  const env = {
    ProgramFiles: 'C:\\Program Files',
    'ProgramFiles(x86)': 'C:\\Program Files (x86)',
    LOCALAPPDATA: 'C:\\Users\\a\\AppData\\Local',
  };
  const c = chromeCandidates('win32', env);
  assert.ok(c.includes('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'));
  assert.ok(c.includes('C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe'));
  assert.ok(c.includes('C:\\Users\\a\\AppData\\Local\\Google\\Chrome\\Application\\chrome.exe'));
  assert.ok(c.includes('C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe'));
});

test('chromeCandidates on Windows skips entries whose env var is missing', () => {
  const c = chromeCandidates('win32', {});
  assert.ok(c.every((p) => !p.includes('undefined')));
});

test('chromeCandidates on Linux searches PATH entries and /usr/bin', () => {
  const c = chromeCandidates('linux', { PATH: '/opt/bin:/usr/local/bin' });
  assert.ok(c.includes('/opt/bin/google-chrome'));
  assert.ok(c.includes('/usr/local/bin/chromium-browser'));
  assert.ok(c.includes('/usr/bin/microsoft-edge'));
});

test('findChrome returns the first candidate that exists', () => {
  const wanted = '/Applications/Chromium.app/Contents/MacOS/Chromium';
  assert.equal(findChrome('darwin', {}, (p) => p === wanted), wanted);
});

test('findChrome prefers earlier candidates', () => {
  const found = findChrome('darwin', {}, () => true);
  assert.equal(found, '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome');
});

test('findChrome returns null when nothing exists', () => {
  assert.equal(findChrome('linux', { PATH: '/usr/bin' }, () => false), null);
});

test('isLaunchFailure recognises a missing-browser error', () => {
  assert.equal(isLaunchFailure(new Error('Failed to launch the browser process!')), true);
  assert.equal(isLaunchFailure(new Error('Could not find Chrome (ver. 123)')), true);
  assert.equal(isLaunchFailure(new Error('something else')), false);
});
