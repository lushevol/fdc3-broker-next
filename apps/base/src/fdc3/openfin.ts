export const OPENFIN_CONTEXT_ROUTING_INTENTS = ['scb.ViewLaunch', 'scb.ViewUpdate'];

type OpenFinBrokerOptions = {
  enableOpenFinBridge: boolean;
  openFinBridgeOptions: {
    globalIntents: string[];
    contextRoutingIntents: string[];
  };
};

export const isOpenFinRuntime = (): boolean => {
  const fin = (globalThis as typeof globalThis & { fin?: { desktop?: unknown } }).fin;
  return !!fin?.desktop;
};

export const getOpenFinBrokerOptions = (): OpenFinBrokerOptions => ({
  enableOpenFinBridge: isOpenFinRuntime(),
  openFinBridgeOptions: {
    globalIntents: OPENFIN_CONTEXT_ROUTING_INTENTS,
    contextRoutingIntents: OPENFIN_CONTEXT_ROUTING_INTENTS,
  },
});
