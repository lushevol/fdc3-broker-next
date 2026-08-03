type eventId = `ie-${string}`;

export function Enum<T extends readonly string[]>(enumerations: T) {
  const reverseKey = 'reverse' as const;
  const target = {
    [reverseKey]: {},
  };

  const map = new Map<T[number], eventId>();
  const reverseMap = new Map<eventId, T[number]>();

  function generateId(): eventId {
    return `ie-${Math.random().toString(16).slice(2)}`;
  }

  enumerations.forEach((eventName) => {
    const id = generateId();
    map.set(eventName, id);
    reverseMap.set(id, eventName);
  });

  return new Proxy(target, {
    get(target, p: T[number]) {
      if (p === reverseKey) {
        return new Proxy(target[reverseKey], {
          get(target, p: T[number]) {
            const valueK = map.get(p);
            if (valueK) {
              return reverseMap.get(valueK);
            }
            return 'unknown';
          },
        });
      } else {
        return map.get(p);
      }
    },
  }) as unknown as Record<T[number], eventId> &
    Record<typeof reverseKey, Record<T[number], T[number]>>;
}
