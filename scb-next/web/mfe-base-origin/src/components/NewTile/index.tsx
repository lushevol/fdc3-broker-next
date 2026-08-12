import React, { ReactElement, useCallback } from "react";
import useController from "./common/useController";
import Root, { classes, PREFIX } from "./common/style";
import search from "./common/images/search.svg";
import searchLight from "./common/images/searchLight.svg";
import newTileLight from "./common/images/new-tile-light.svg";
import newTileLightHover from "./common/images/new-tile-light-hover.svg";
import newTileLightSelected from "./common/images/new-tile-light-selected.svg";
import newTileDark from "./common/images/new-tile-dark.svg";
import newTileDarkHover from "./common/images/new-tile-dark-hover.svg";
import newTileDarkSelected from "./common/images/new-tile-dark-selected.svg";
import { NewTileProps } from "./common/interface";
import { useIsNewLayout } from "../../hooks/model/root";

const NewTile: React.FC<NewTileProps> = (props: NewTileProps): ReactElement => {
  const { store } = useController();
  const theme = store.theme === "dark" ? search : searchLight;
  // when we change to new design, we need to delete the import and isNewLayout variable
  // And do some changes based on isNewLayout is true
  const isNewLayout = useIsNewLayout();
  const { toggleDrawer } = props;
  const isDrawerOpen = !!store.drawer;
  const newTileIconClassNames = [
    "new-tile-icon",
    "new-tile-icon-hover",
    "new-tile-icon-selected",
  ];
  const newTileIconSources =
    store.theme === "light"
      ? [newTileLight, newTileLightHover, newTileLightSelected]
      : [newTileDark, newTileDarkHover, newTileDarkSelected];

  const openDrawer = useCallback(() => {
    toggleDrawer(!isDrawerOpen)();
  }, [toggleDrawer, isDrawerOpen]);
  return (
    <Root
      className={
        isNewLayout ? `${classes.root} new-tile-icon-wrapper` : classes.root
      }
      data-testid={`${PREFIX}`}
      onClick={openDrawer}
    >
      {!isNewLayout ? (
        <>
          <span className={classes.box}>
            <img src={theme} alt="new tile" />
          </span>
          <span className={classes.title}>New Tile</span>
        </>
      ) : (
        <button
          type="button"
          className={`${classes.box}${isDrawerOpen ? " selected" : ""}`}
          aria-label="Open new tile"
          aria-pressed={isDrawerOpen}
        >
          {newTileIconSources.map((src, i) => (
            <img
              key={newTileIconClassNames[i]}
              className={newTileIconClassNames[i]}
              src={src}
              alt="New Tile Icon"
              width={20}
              height={20}
            />
          ))}
        </button>
      )}
    </Root>
  );
};

export default React.memo(NewTile);
