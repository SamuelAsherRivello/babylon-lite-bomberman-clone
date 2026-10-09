import { spawn, spawnSync } from 'node:child_process';
import { existsSync, mkdirSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { setTimeout as delay } from 'node:timers/promises';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const serverDir = join(root, '.tmp', 'multiplayer-server-v0.9.7');
const siblingServer = resolve(root, '..', 'rmc-colyseus-multiplayer-server');
const serverTag = 'v0.9.7';
const localServer = 'http://127.0.0.1:2567';
const children = [];

function run(command, args, options = {}) {
  const result = spawnSync(command, args, { stdio: 'inherit', ...options });
  if (result.error) throw result.error;
  if (result.status !== 0) throw new Error(`${command} exited with code ${result.status}`);
}

function prepareServer() {
  const packageFile = join(serverDir, 'package.json');
  if (!existsSync(packageFile)) {
    mkdirSync(dirname(serverDir), { recursive: true });
    const source = existsSync(join(siblingServer, '.git'))
      ? siblingServer
      : 'https://github.com/SamuelAsherRivello/rmc-colyseus-multiplayer-server.git';
    console.log(`Preparing isolated multiplayer server ${serverTag} from ${source}`);
    run('git', ['clone', '--quiet', '--branch', serverTag, '--single-branch', source, serverDir]);
  }
  const tsx = join(serverDir, 'node_modules', 'tsx', 'dist', 'cli.mjs');
  if (!existsSync(tsx)) {
    console.log('Installing dependencies for the isolated multiplayer server...');
    run('npm ci', [], { cwd: serverDir, shell: true });
  }
  return tsx;
}

async function health(port) {
  try {
    const response = await fetch(`http://127.0.0.1:${port}/api/health`, {
      signal: AbortSignal.timeout(500),
    });
    return response.ok ? response.json() : null;
  } catch {
    return null;
  }
}

async function waitForServer(child, port) {
  for (let attempt = 0; attempt < 100; attempt++) {
    if (child.exitCode !== null) throw new Error(`Local server on port ${port} exited early.`);
    const state = await health(port);
    if (state) {
      if (state.version !== '0.9.7' || !state.games?.includes('bomberman'))
        throw new Error(`Unexpected multiplayer server on port ${port}.`);
      return;
    }
    await delay(100);
  }
  throw new Error(`Local multiplayer server on port ${port} did not become ready.`);
}

function stopChildren() {
  for (const child of children) {
    if (child.exitCode !== null) continue;
    if (process.platform === 'win32')
      spawnSync('taskkill', ['/PID', String(child.pid), '/T', '/F'], { stdio: 'ignore' });
    else child.kill();
  }
}

try {
  for (const port of [2567, 2568]) {
    if (await health(port))
      throw new Error(`Port ${port} is already serving a multiplayer backend. Stop it first.`);
  }
  const tsx = prepareServer();
  for (const port of [2567, 2568]) {
    const env = { ...process.env, PORT: String(port) };
    delete env.VERCEL;
    const child = spawn(process.execPath, [tsx, join(serverDir, 'server.ts')], {
      cwd: serverDir,
      env,
      stdio: 'inherit',
    });
    children.push(child);
    await waitForServer(child, port);
    console.log(`Local ${port === 2567 ? 'play' : 'AI test'} server: http://127.0.0.1:${port}`);
  }
  const vite = spawn(
    process.execPath,
    [
      join(root, 'node_modules', 'vite', 'bin', 'vite.js'),
      '--host',
      '127.0.0.1',
      ...process.argv.slice(2),
    ],
    {
      cwd: root,
      env: { ...process.env, VITE_MULTIPLAYER_URL: localServer },
      stdio: 'inherit',
    },
  );
  children.push(vite);
  console.log(
    'Use ?server=VITE_LOCAL for local play or ?server=VITE_LOCAL&serverTest=true for AI tests.',
  );
  for (const signal of ['SIGINT', 'SIGTERM']) process.once(signal, stopChildren);
  const code = await new Promise((done) => vite.once('exit', done));
  stopChildren();
  process.exitCode = code || 0;
} catch (error) {
  console.error(error.message);
  stopChildren();
  process.exitCode = 1;
}
