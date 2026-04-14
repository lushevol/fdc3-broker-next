import type { ChatStreamFrame } from '@fm/chat-protocol-contract';

export function serializeSseFrame(frame: ChatStreamFrame): string {
  return `data: ${JSON.stringify(frame)}\n\n`;
}

export async function writeSseFrames(
  frames: AsyncIterable<ChatStreamFrame> | Iterable<ChatStreamFrame>,
  writer: (chunk: string) => void,
  delayMs = 25,
): Promise<void> {
  for await (const frame of frames) {
    writer(serializeSseFrame(frame));
    if (delayMs > 0) {
      await new Promise((resolve) => setTimeout(resolve, delayMs));
    }
  }
}
