import React, {
  FC,
  ReactElement,
  Fragment,
  createContext,
  useState,
  useEffect,
} from "react";
import { createPortal } from "react-dom";

import { randomString } from "../../ratanutils/utils";

interface PortalManager {
  open: Function;
}

export const PortalContext = createContext<PortalManager | undefined>(
  undefined
);

interface Portal {
  id: string;
  element: Function | ReactElement;
}

interface OpenOptions {
  id?: string;
  onClose?: Function;
}

export const PortalProvider: FC = () => {
  const [portals, setPortals] = useState<Portal[]>([]);
  const close = (portalId: string) => {
    setPortals((oldPortals) => oldPortals.filter(({ id }) => id !== portalId));
  };

  const open = (
    element: Function | ReactElement,
    options: OpenOptions = {}
  ) => {
    const { id = randomString(5), onClose } = options;
    const portal = {
      close: () => {
        close(id);
        onClose?.();
      },
    };

    const portalElement =
      typeof element === "function" ? element(portal) : element;
    setPortals([...portals, { id, element: portalElement }]);
  };

  useEffect(() => {
    window.openPortal = open;
  }, []);

  return (
    <>
      {portals.map(({ element, id }) => (
        <Fragment key={id}>
          {createPortal(element as ReactElement, document.body)}
        </Fragment>
      ))}
    </>
  );
};
