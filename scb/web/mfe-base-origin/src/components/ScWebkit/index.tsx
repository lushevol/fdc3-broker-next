import React from "react";
import ReactWrapper from "../../utils/ReactWrapper";

const ScWebkit = (props) => {
  const { component, ...rest } = props;
  const ImportedComponent = React.useMemo(() => {
    const registry = customElements.get(component);
    if (!registry) {
      import(`./${component}`);
    }
    return ReactWrapper(component);
  }, []);
  return <ImportedComponent {...rest} />;
};

export default React.memo(ScWebkit);
