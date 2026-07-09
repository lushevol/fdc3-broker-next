import { OPENFIN_CONTEXT_ROUTING_INTENTS, getOpenFinBrokerOptions } from './openfin';

type BrowserInteropBrokerOptions = ReturnType<typeof getOpenFinBrokerOptions> & {
  enablePostMessageBridge: boolean;
  postMessageBridgeOptions: {
    allowedOrigins: string[];
    contextRoutingIntents: string[];
  };
};

const parseAllowedOrigins = (rawOrigins: string | undefined): string[] =>
  (rawOrigins ?? '')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);

export const getPostMessageBrokerOptions = (): Pick<
  BrowserInteropBrokerOptions,
  'enablePostMessageBridge' | 'postMessageBridgeOptions'
> => {
  const postMessageAllowedOrigins = parseAllowedOrigins(
    process.env.FDC3_POSTMESSAGE_ALLOWED_ORIGINS,
  );

  return {
    enablePostMessageBridge: postMessageAllowedOrigins.length > 0,
    postMessageBridgeOptions: {
      allowedOrigins: postMessageAllowedOrigins,
      contextRoutingIntents: OPENFIN_CONTEXT_ROUTING_INTENTS,
    },
  };
};

export const getBrowserInteropBrokerOptions = (): BrowserInteropBrokerOptions => ({
  ...getOpenFinBrokerOptions(),
  ...getPostMessageBrokerOptions(),
});
