import AddIcon from '@mui/icons-material/Add';
import Button from '@mui/material/Button';
import React, { type ReactElement } from 'react';
import { useContext } from '../../hooks/provider';
import type { TileProps } from './common/interface';
import Root, { backgroundCss, classes, PREFIX } from './common/style';

const Tile: React.FC<TileProps> = (props: TileProps): ReactElement => {
  const [store] = useContext();
  const { theme } = store;

  return (
    <Root
      data-testid={`${PREFIX}`}
      onClick={props.disabled ? undefined : props.onClick}
      className={backgroundCss(props, theme)}
    >
      <main className={classes.main}>
        <section className={props.disabled ? classes.titledisabled : classes.title}>
          {props.title}
          <p>{props?.subtitle}</p>
        </section>
        <section className={classes.content}>
          <Button variant="outlined" disabled={props.disabled}>
            <AddIcon />
          </Button>
        </section>
      </main>
    </Root>
  );
};

export default React.memo(Tile);
