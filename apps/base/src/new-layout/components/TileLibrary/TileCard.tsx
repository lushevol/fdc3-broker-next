import { Star } from 'lucide-react';
import useController from '../../../components/Drawer/common/MenuItem.useController';
import { ScBadge, ScButton } from '../../webkit/components';
import type { TileCardProps } from './types';

const TileCard = ({ tile, ...props }: TileCardProps) => {
  const { onClick } = useController(props, tile);
  const icon = tile.imageLightTheme ?? tile.imageDarkTheme;
  const id = tile.tile || tile.module || tile.title;
  const isFavorite = props.favoriteTileIds?.has(id) ?? false;
  const openTile = () => {
    props.onOpenTile?.(tile);
    onClick();
  };

  return (
    <article className="tile-library-card">
      <div className="tile-library-card-content">
        <div className="tile-library-card-heading">
          <span className="tile-library-icon" aria-hidden="true">
            <span>{tile.title.slice(0, 1).toUpperCase()}</span>
            {icon && (
              <img
                src={icon}
                alt=""
                onError={(event) => {
                  event.currentTarget.hidden = true;
                }}
              />
            )}
          </span>
          <div className="tile-library-card-title">
            <h3>{tile.title}</h3>
            {tile.subtitle && <p>{tile.subtitle}</p>}
          </div>
          <ScButton
            type="text"
            size="xs"
            className="tile-library-favorite"
            role="button"
            aria-label={`${isFavorite ? 'Remove' : 'Add'} ${tile.title} ${isFavorite ? 'from' : 'to'} favorites`}
            aria-pressed={isFavorite}
            onClick={() => props.onToggleFavorite?.(tile)}
          >
            <Star size={15} fill={isFavorite ? 'currentColor' : 'none'} aria-hidden="true" />
          </ScButton>
        </div>
        <p className="tile-library-card-description">
          {tile.description ?? `Open ${tile.title} in the current workspace.`}
        </p>
        {tile.disabled ? (
          <ScBadge type="text" color="grey" label="Unavailable" />
        ) : (
          <ScButton
            type="primary"
            size="xs"
            noPill
            width="100%"
            role="button"
            onClick={openTile}
            aria-label={`Open ${tile.title}`}
          >
            Open
          </ScButton>
        )}
      </div>
    </article>
  );
};

export default TileCard;
