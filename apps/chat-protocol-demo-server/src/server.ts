import cors from 'cors';
import express from 'express';
import type { ChatRunRequest } from '@fm/chat-protocol-contract';
import { DeterministicWeatherDemoRunService, writeSseFrames } from '@fm/chat-protocol-demo-support';

const app = express();
const service = new DeterministicWeatherDemoRunService();
const port = Number.parseInt(process.env.PORT ?? '4111', 10);

app.use(cors());
app.use(express.json());

app.get('/health', (_request, response) => {
  response.json({
    ok: true,
    service: 'chat-protocol-demo-server',
  });
});

app.post('/api/chat/runs', async (request, response) => {
  const payload = request.body as ChatRunRequest;

  response.status(200);
  response.setHeader('Content-Type', 'text/event-stream; charset=utf-8');
  response.setHeader('Cache-Control', 'no-cache, no-transform');
  response.setHeader('Connection', 'keep-alive');
  response.flushHeaders?.();

  try {
    await writeSseFrames(service.streamRun(payload), (chunk) => {
      response.write(chunk);
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown streaming error';
    response.write(
      `data: ${JSON.stringify({ type: 'error', message, code: 'demo_stream_failed' })}\n\n`,
    );
  } finally {
    response.end();
  }
});

app.listen(port, () => {
  console.log(`chat-protocol-demo-server listening on http://127.0.0.1:${port}`);
});
