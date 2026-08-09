import { ButtonProps } from "@mui/material/Button";
export interface LoadingButtonProps extends ButtonProps {
  loading?: boolean;
  children?: React.ReactNode;
  loadingSize?: number;
}
