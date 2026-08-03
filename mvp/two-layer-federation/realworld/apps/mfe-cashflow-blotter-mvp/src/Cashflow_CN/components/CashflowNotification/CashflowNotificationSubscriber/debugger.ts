export const notificationDebugger = () => {
  const messages: any[] = [];
  window.__RATAN_NOTIFICATION_DEBUGGER__ = messages;
  return {
    add: (message) => {
      messages.unshift(message);
      messages.splice(100);
      console.table(messages);
    },
  };
};
