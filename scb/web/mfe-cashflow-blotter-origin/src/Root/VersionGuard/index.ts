import { App } from "antd";
import { useEffect } from "react";

import Package from "../../../package.json";
import { featureScopedEnabled } from "../common/utils/featureFlagController";

export const useVersionGuard = () => {
  const { modal } = App.useApp();
  useEffect(() => {
    if (featureScopedEnabled("Version_Guard")) {
      fetch("/ratan_cashflow_blotter/version.json?t=" + Date.now(), {
        cache: "no-store",
      })
        .then((resp) => {
          return resp.json();
        })
        .then((resp) => {
          if (resp?.version !== Package.version) {
            modal.confirm({
              title: `Application version updated from ${Package.version} to ${resp.version}.`,
              content: "Please refresh to get the latest.",
              onOk() {
                window.location.reload();
              },
            });
          }
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }, []);
};
