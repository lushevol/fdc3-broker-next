import React, { ReactElement } from "react";
import { Autocomplete, Stack, IconButton } from "ratan-design-origin/primitives";
import { KeyboardArrowDown as KeyboardArrowDownIcon, Refresh as RefreshIcon } from "ratan-design-origin/icons";
import Root, { classes, PREFIX } from "./common/style";
import { TileProps } from "./common/interface";
import useController from "./common/useController";
import ErrorBoundry from "../../components/ErrorBoundry";
import Main from "../common/Main";
import Input from "../../components/Input";

const Tile: React.FC<TileProps> = (props: TileProps): ReactElement => {
  const {
    store,
    categories,
    category,
    onCategoryChange,
    onInputChange,
    inputValue,
    refresh,
    disableCreateNew,
    ...rest
  } = useController(props);
  return (
    <ErrorBoundry>
      <Root
        className={classes.root}
        data-testid={`${PREFIX}`}
        spacing={2}
        direction="column"
      >
        <Stack direction="row" spacing={1}>
          <Autocomplete
            disablePortal
            value={category}
            onChange={onCategoryChange}
            options={categories}
            inputValue={inputValue}
            onInputChange={onInputChange}
            popupIcon={<KeyboardArrowDownIcon />}
            sx={{ width: 500 }}
            renderInput={(params) => (
              <Input
                {...params}
                label="Application Category"
                variant="outlined"
                labelPosition="left"
                placeholder="Please select application category"
                slotProps={{ inputLabel: { shrink: true } }}
              />
            )}
          />
          <IconButton
            aria-label="refresh"
            disabled={!category}
            onClick={refresh}
          >
            <RefreshIcon />
          </IconButton>
        </Stack>
        <Main
          titleCreateNew="Create New Tile"
          columnVisibilityModel={{
            createdBy: false,
            createdAt: false,
            applicationCategory: false,
          }}
          disabledCreateNew={disableCreateNew}
          {...rest}
        />
      </Root>
    </ErrorBoundry>
  );
};

export default React.memo(Tile);
