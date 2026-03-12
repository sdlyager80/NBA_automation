export const simulateDelay = (baseMs = 600): Promise<void> =>
  new Promise(resolve => setTimeout(resolve, baseMs + Math.random() * 300));

export const simulateNIPRDelay = (): Promise<void> =>
  new Promise(resolve => setTimeout(resolve, 1200 + Math.random() * 400));
