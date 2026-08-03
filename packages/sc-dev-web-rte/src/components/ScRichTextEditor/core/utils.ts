export function editorCommand(command: string, value?: string) {
  try {
    document.execCommand(command, false, value);
    return true;
  } catch (e) {
    return false;
  }
}

function unit2hex(unit: number) {
  const hex = unit.toString(16);
  return hex.length === 1 ? `0${hex}` : hex;
}

export function rgb2hex(rgb?: string) {
  if (!rgb) {
    return undefined;
  }
  const [r, g, b] = rgb
    .replace(/rgba*/, '')
    .slice(1, -1)
    .split(',')
    .map(_ => _.trim());
  return `#${unit2hex(+r)}${unit2hex(+g)}${unit2hex(+b)}`;
}

export function makeReactiveObj(
  reactiveMapping: Record<string, any>,
  callback: (value: string) => any
) {
  const res = { };
  Object.entries(reactiveMapping).forEach(([k, v]) => {
    Object.defineProperty(res, k, {
      get: () => {
        return callback(v);
      },
      configurable: true,
    });
  });
  return res;
}

export function invertObject(obj: Record<string, any>) {
  const inverted = {} as any;
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      inverted[obj[key]] = key;
    }
  }
  return inverted;
}

export const node = {
  isText(node: Node) {
    return node instanceof Text;
  },
  isComment(node: Node) {
    return node instanceof Comment;
  },
};
