import SearchIcon from '@mui/icons-material/Search';
import React, { type ReactElement } from 'react';
import type { NewTileProps } from './common/interface';
import Root, { classes, PREFIX } from './common/style';

const NewTile: React.FC<NewTileProps> = (props: NewTileProps): ReactElement => {
  return (
      <Root
        className={classes.root}
        data-testid={`${PREFIX}`}
        onClick={props.toggleDrawer(true)}
      >
        <span className={classes.box}>
          <SearchIcon />
        </span>
        <span className={classes.title}>New Tile</span>
      </Root>
  );
};

export default React.memo(NewTile);
