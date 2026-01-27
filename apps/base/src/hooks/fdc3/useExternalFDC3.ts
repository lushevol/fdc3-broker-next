import type { DesktopAgent, Listener } from '@finos/fdc3';
import { useEffect, useRef } from 'react';
import baseBroker from './base-broker';
import { useIsLogin } from './useIsLogin';
import { filterDuplicateDeclaredIntents } from './utils';

let externalFDC3: DesktopAgent | undefined;

export const setExternalFDC3 = (fdc3Instance?: DesktopAgent) => {
  externalFDC3 = fdc3Instance;
};

export const getExternalFDC3 = () => {
  return externalFDC3;
};

const EXTERNAL_INTENTS = ['scb.ViewLaunch', 'scb.ViewUpdate'];
const EXTERNAL_INBOUND_INTENTS = 'EXTERNAL_INBOUND_INTENTS';

export const useExternalFDC3 = () => {
  const { isLogin } = useIsLogin();
  const isUnsubscribing = useRef(false);
  useEffect(() => {
    if (getExternalFDC3() && !isUnsubscribing.current) {
      const unsubscribes: Promise<Listener>[] = [];

      EXTERNAL_INTENTS.forEach((predefinedIntent) => {
        const unsubscribe = getExternalFDC3()!.addIntentListener(
          predefinedIntent,
          async (context, _contextMetadata) => {
            console.log(
              `[FMPTP FDC3] Received intent from external: ${predefinedIntent} with context type ${context.type}`,
            );
            if (isLogin) {
              const res = await baseBroker.handleRaiseIntentForContext(
                context,
                // contextMetadata?.source
              );

              return res.getResult();
            } else {
              console.log(`[FMPTP FDC3] User is not logged in. queue intent: ${predefinedIntent}`);
              sessionStorage.setItem(
                EXTERNAL_INBOUND_INTENTS,
                JSON.stringify(
                  sessionStorage.getItem(EXTERNAL_INBOUND_INTENTS)
                    ? [
                        ...JSON.parse(sessionStorage.getItem(EXTERNAL_INBOUND_INTENTS) || '[]'),
                        { intent: predefinedIntent, context },
                      ]
                    : [{ intent: predefinedIntent, context }],
                ),
              );
            }
          },
        );

        unsubscribes.push(unsubscribe);
      });

      if (isLogin) {
        baseBroker.getAllDeclaredIntents().then((declaredIntents) => {
          console.log('[FMPTP FDC3] Retrieved declared intents: ', declaredIntents);
          declaredIntents.filter(filterDuplicateDeclaredIntents()).forEach((intent) => {
            const unsubscribe = getExternalFDC3()!.addIntentListener(
              intent.intent,
              async (context, _contextMetadata) => {
                console.log(
                  `[FMPTP FDC3] Received intent from external: ${intent.intent} with context type ${context.type}`,
                );
                const res = await baseBroker.handleRaiseIntent(
                  intent.intent,
                  context,
                  // contextMetadata?.source
                );

                return res.getResult();
              },
            );

            unsubscribes.push(unsubscribe);
          });
        });
      }

      return () => {
        isUnsubscribing.current = true;
        Promise.allSettled(unsubscribes)
          .then((uss) => uss.map((us) => us.status === 'fulfilled' && us.value.unsubscribe()))
          .finally(() => (isUnsubscribing.current = false));
      };
    }
  }, [isLogin]);
};
