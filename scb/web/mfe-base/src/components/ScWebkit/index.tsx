import React from "react";
import ReactWrapper from "../../utils/ReactWrapper";
import { loadScWebkitElement } from "../../new-styles/sc-webkit-registration";

interface ScWebkitProps extends React.HTMLAttributes<HTMLElement> {
  component: string;
}

const ScWebkit = (props: ScWebkitProps) => {
  const { component, ...rest } = props;
  const ImportedComponent = React.useMemo(() => {
    const registry = customElements.get(component);
    if (!registry) {
      loadScWebkitElement(component);
    }
    return ReactWrapper(component);
  }, []);
  return <ImportedComponent {...rest} />;
};

export default React.memo(ScWebkit);
