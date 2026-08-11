import React, { ReactElement } from "react";
import ErrorBoundry from "../../../components/ErrorBoundry";
import { useContext } from "../../../hooks/provider";
import { DateTimeFormat } from "../../../utils/locale";

interface DateTimeProps {
  value?: string;
}

const DateTime = (props: DateTimeProps): ReactElement => {
  const { value } = props;
  const [store] = useContext();
  const date = React.useMemo(() => {
    let date = new Date();
    if (value?.length) {
      date = new Date(value);
    }
    return DateTimeFormat(
      store?.timeType?.toUpperCase(),
      date,
      "en",
      "medium",
      "medium"
    );
  }, [value, store?.timeType]);
  return (
    <ErrorBoundry>
      <span>{date}</span>
    </ErrorBoundry>
  );
};

export default React.memo(DateTime);
