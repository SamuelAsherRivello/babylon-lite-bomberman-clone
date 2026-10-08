// Adapted from the updated template. WebGPU remains the only game renderer.
export function getInitializationMessage(webGpuAvailable, error) {
  const reason = String(error?.message ?? error ?? '');
  if (!webGpuAvailable || /webgpu|adapter.*(?:not available|unsupported|not found)/i.test(reason)) {
    return 'This game requires WebGPU. Enable WebGPU or use a compatible browser and device.';
  }
  if (
    /render.?target|allocation|out of memory|device lost|texture.*(?:limit|dimension|memory)/i.test(
      reason,
    )
  ) {
    return 'The game could not allocate its graphics surface. Try a smaller browser window, then reload. Details are in the browser console.';
  }
  return 'The game could not initialize its graphics. Reload or try a compatible WebGPU browser. Details are in the browser console.';
}
