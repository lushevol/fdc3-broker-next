import * as fdc3 from 'ratan-fdc3/finos';
import * as openFinFdc3 from 'ratan-fdc3/openfin';
import React from 'react';
import useDispatcher from '../../../hooks/dispathcer';
import { useContext } from '../../../hooks/provider';
import { getEnv } from '../../../utils/common';
import { broadcastUtil, fdc3InitUtil } from './util';

const useOpenfin = (openTile) => {
  const [store] = useContext();
  const { dispacthTheme } = useDispatcher();
  const [channel, setChannel] = React.useState<any>();
  const [channelMessage, setChannelMessage] = React.useState<any>();
  const [intentListener, setIntentListener] = React.useState<any>();
  const handleIntentListener = React.useCallback(
    (payload) => {
      if (payload?.request === 'changeTheme') {
        dispacthTheme(payload.theme);
      } else if (payload?.request === 'broadcastMessage') {
        setChannelMessage(payload.message);
      } else if (payload?.request === 'openTile') {
        const { container, module, tile, parameters } = payload;
        openTile(container, module, tile, parameters);
      }
    },
    [openTile],
  );
  const fdc3Init = React.useCallback(async () => {
    const c = await openFinFdc3?.getOrCreateAppChannel('fmchannel');
    c.join();
    const inten = await openFinFdc3?.addIntentListener('fmchannel.fmoportal', handleIntentListener);
    setIntentListener(inten);
    const channel_ = await fdc3.getOrCreateChannel('fmchannel');
    channel_?.addContextListener('fmchannel', handleIntentListener);
    setChannel(channel_);
  }, [fdc3, openFinFdc3]);
  const clearListener = React.useCallback(() => {
    intentListener?.unsubscribe();
  }, [intentListener]);
  React.useEffect(() => {
    fdc3InitUtil(window.fin, fdc3, openFinFdc3, getEnv(), fdc3Init);
    return clearListener;
  }, []);
  const clearMessage = React.useCallback(() => setChannelMessage(undefined), [channelMessage]);
  const broadcast = React.useCallback(
    async (payload) => {
      await broadcastUtil(window.fin, channel, getEnv(), payload);
    },
    [channel],
  );
  React.useEffect(() => {
    broadcast({
      type: 'fmchannel',
      request: 'changeTheme',
      theme: store.theme,
    });
  }, [store.theme]);
  return {
    channelMessage,
    clearMessage,
    fdc3Init,
    handleIntentListener,
    clearListener,
    setChannelMessage,
  };
};

export default useOpenfin;
