/// <reference types="react" />
export interface TileProps {
  title: string;
  subtitle?: string;
  imageDarkTheme: string;
  imageLightTheme: string;
  onClick: (event: React.MouseEvent<HTMLElement>) => void;
  disabled?: boolean;
  leftPosition?: string;
  topPossition?: string;
}
