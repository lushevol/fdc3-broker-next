import { createAlphaPaymentsServer } from "./server.mjs";

const port = Number.parseInt(process.env.ALPHA_PAYMENTS_API_PORT ?? "8086", 10);
const server = createAlphaPaymentsServer({
  logger: (entry) => console.log(JSON.stringify(entry))
});

server.listen(port, "127.0.0.1", () => {
  console.log(
    JSON.stringify({
      event: "service.started",
      service: "alpha-payments-api",
      tenantId: "alpha-payments",
      port
    })
  );
});

function shutdown(signal) {
  server.close(() => {
    console.log(
      JSON.stringify({
        event: "service.stopped",
        service: "alpha-payments-api",
        tenantId: "alpha-payments",
        signal
      })
    );
  });
}

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));
