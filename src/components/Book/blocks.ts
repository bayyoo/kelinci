import { Message } from '../../content/level1';

export type Block =
  | { type: 'title'; text: string }
  | { type: 'para'; text: string }
  | { type: 'sign'; text: string };

const blockClass = (block: Block): string => {
  switch (block.type) {
    case 'title':
      return 'page-title';
    case 'sign':
      return 'page-sign final-page-signature';
    default:
      return 'page-para';
  }
};

export const createBlockEl = (block: Block): HTMLElement => {
  const el =
    block.type === 'title'
      ? document.createElement('h2')
      : block.type === 'para'
        ? document.createElement('p')
        : document.createElement('div');
  el.className = blockClass(block);
  el.textContent = block.text;
  return el;
};

const buildBlocks = (messages: Message[]): Block[] => {
  const blocks: Block[] = [];
  for (const message of messages) {
    if (message.title) blocks.push({ type: 'title', text: message.title });
    for (const paragraph of message.body) blocks.push({ type: 'para', text: paragraph });
  }
  const last = messages[messages.length - 1];
  if (last?.signature) blocks.push({ type: 'sign', text: last.signature });
  return blocks;
};

const createProbe = (measurer: HTMLElement): HTMLDivElement => {
  const probe = document.createElement('div');
  probe.className = 'book-page-copy';
  probe.style.position = 'absolute';
  probe.style.left = '-99999px';
  probe.style.top = '0';
  probe.style.width = `${measurer.clientWidth}px`;
  probe.style.height = 'auto';
  probe.style.flex = '0 0 auto';
  probe.style.visibility = 'hidden';
  probe.style.pointerEvents = 'none';
  document.body.appendChild(probe);
  return probe;
};

// Measures each block's height (including the gap created by the previous
// block's margin) using an auto-height clone with identical typography.
const measureHeights = (probe: HTMLElement, blocks: Block[]): { heights: number[]; padding: number } => {
  const padding = probe.scrollHeight;
  let prev = padding;
  const heights: number[] = [];
  for (const block of blocks) {
    probe.appendChild(createBlockEl(block));
    const height = probe.scrollHeight;
    heights.push(height - prev);
    prev = height;
  }
  return { heights, padding };
};

export const paginate = (messages: Message[], measurer: HTMLElement): Block[][] => {
  const blocks = buildBlocks(messages);
  const available = measurer.clientHeight;

  if (available <= 1 || blocks.length === 0) {
    return [blocks];
  }

  const probe = createProbe(measurer);
  const { heights, padding } = measureHeights(probe, blocks);
  probe.remove();

  const cap = Math.max(1, available - padding);
  // Leave room at the bottom of the last page for the cat picture.
  const catReserve = Math.round(cap * 0.28);
  const finalCap = Math.max(1, cap - catReserve);

  // prefix[i] = height of the first i blocks (content only, padding excluded)
  const prefix = new Array(blocks.length + 1).fill(0);
  for (let i = 0; i < blocks.length; i++) prefix[i + 1] = prefix[i] + heights[i];
  const total = prefix[blocks.length];

  let pageCount = Math.max(1, Math.ceil((total + catReserve) / cap));

  const INF = Number.POSITIVE_INFINITY;
  const solve = (count: number): number[][] | null => {
    const dp: number[][] = Array.from({ length: count + 1 }, () => new Array(blocks.length + 1).fill(INF));
    const from: number[][] = Array.from({ length: count + 1 }, () => new Array(blocks.length + 1).fill(-1));
    dp[0][0] = 0;
    for (let page = 1; page <= count; page++) {
      const limit = page === count ? finalCap : cap;
      for (let end = 1; end <= blocks.length; end++) {
        for (let start = page - 1; start < end; start++) {
          if (dp[page - 1][start] === INF) continue;
          const height = prefix[end] - prefix[start];
          if (height > limit) continue;
          const cost = (limit - height) * (limit - height);
          if (dp[page - 1][start] + cost < dp[page][end]) {
            dp[page][end] = dp[page - 1][start] + cost;
            from[page][end] = start;
          }
        }
      }
    }
    return dp[count][blocks.length] === INF ? null : from;
  };

  let from = solve(pageCount);
  let guard = 0;
  while (!from && pageCount < blocks.length + 1) {
    pageCount++;
    from = solve(pageCount);
    guard++;
    if (guard > blocks.length + 2) break;
  }
  if (!from) return [blocks];

  const pages: Block[][] = [];
  let end = blocks.length;
  for (let page = pageCount; page >= 1; page--) {
    const start = from[page]?.[end] ?? 0;
    pages.unshift(blocks.slice(start, end));
    end = start;
  }
  if (end > 0) pages.unshift(blocks.slice(0, end));
  return pages.filter((page) => page.length > 0);
};
