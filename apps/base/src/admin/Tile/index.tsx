import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import RefreshIcon from '@mui/icons-material/Refresh';
import Autocomplete from '@mui/material/Autocomplete';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import React, { type ReactElement } from 'react';
import ErrorBoundry from '../../components/ErrorBoundry';
import Input from '../../components/Input';
import Main from '../common/Main';
import type { TileProps } from './common/interface';
import Root, { classes, PREFIX } from './common/style';
import useController from './common/useController';

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
      <Root className={classes.root} data-testid={`${PREFIX}`} spacing={2} direction="column">
        <Stack direction="row" spacing={1}>
          <Autocomplete
            disablePortal
            value={category}
            onChange={onCategoryChange}
            options={categories as []}
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
                InputLabelProps={{
                  shrink: true,
                }}
              />
            )}
          />
          <IconButton aria-label="refresh" disabled={!category} onClick={refresh}>
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
