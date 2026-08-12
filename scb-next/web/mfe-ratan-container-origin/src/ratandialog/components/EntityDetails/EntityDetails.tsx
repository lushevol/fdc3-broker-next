import React, { FC, memo, useMemo } from "react";

import Root from "./EntityDetailsStyle";

interface EntityDetailsProps {
  data: any;
}

export const EntityDetails: FC<EntityDetailsProps> = memo(({ data }) => {
  const setItem = useMemo(() => {
    return data.map((item: any) => {
      return (
        <tr className="entity-details-popover-item" key={item.key}>
          <td className="entity-details-popover-label">{item.key}</td>
          <td className="entity-details-popover-label">{item.version}</td>
        </tr>
      );
    });
  }, [data]);

  return (
    <Root className="entity-details-popover">
      <div className="entity-details-popover-name">Booking Entity Detail</div>
      <table>
        <tbody>{setItem}</tbody>
      </table>
    </Root>
  );
});
