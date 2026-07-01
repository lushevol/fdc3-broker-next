import { TextFieldProps, TextFieldVariants } from "@mui/material/TextField";
export declare const InputStyled: (c: any) => ({ theme }: { theme: any }) => {
  [x: string]:
    | string
    | number
    | {
        display: string;
        flexDirection: string;
        alignItems: string;
        "& .MuiFormLabel-root": {
          marginRight: any;
          marginBottom: number;
        };
        margin?: undefined;
        position?: undefined;
        fontSize?: undefined;
        transformOrigin?: undefined;
        textOverflow?: undefined;
        overflow?: undefined;
        transform?: undefined;
        textTransform?: undefined;
        marginRight?: undefined;
        marginBottom?: undefined;
        backgroundColor?: undefined;
      }
    | {
        margin: number;
        display?: undefined;
        flexDirection?: undefined;
        alignItems?: undefined;
        "& .MuiFormLabel-root"?: undefined;
        position?: undefined;
        fontSize?: undefined;
        transformOrigin?: undefined;
        textOverflow?: undefined;
        overflow?: undefined;
        transform?: undefined;
        textTransform?: undefined;
        marginRight?: undefined;
        marginBottom?: undefined;
        backgroundColor?: undefined;
      }
    | {
        position: string;
        fontSize: string;
        transformOrigin: string;
        textOverflow: string;
        overflow: string;
        transform: string;
        textTransform: string;
        marginRight: number;
        marginBottom: any;
        backgroundColor: string;
        display?: undefined;
        flexDirection?: undefined;
        alignItems?: undefined;
        "& .MuiFormLabel-root"?: undefined;
        margin?: undefined;
      }
    | {
        display: string;
        flexDirection?: undefined;
        alignItems?: undefined;
        "& .MuiFormLabel-root"?: undefined;
        margin?: undefined;
        position?: undefined;
        fontSize?: undefined;
        transformOrigin?: undefined;
        textOverflow?: undefined;
        overflow?: undefined;
        transform?: undefined;
        textTransform?: undefined;
        marginRight?: undefined;
        marginBottom?: undefined;
        backgroundColor?: undefined;
      };
  margin: number;
  width: string;
  "& .MuiFormControl-root": {
    margin: number;
  };
  "& .MuiOutlinedInput-root": {
    margin: number;
  };
  "& .MuiFormLabel-root": {
    position: string;
    fontSize: string;
    transformOrigin: string;
    textOverflow: string;
    overflow: string;
    transform: string;
    textTransform: string;
    marginRight: number;
    marginBottom: any;
    backgroundColor: string;
  };
  "& legend": {
    display: string;
  };
};
export interface InputProps extends Omit<TextFieldProps, "variant"> {
  labelPosition?: "top" | "left";
  variant: TextFieldVariants;
  hidden?: boolean;
  disabled?: boolean;
}
export default function Input({
  labelPosition,
  variant: _variant,
  hidden,
  disabled: _disabled,
  ...rest
}: Readonly<InputProps>): import("react/jsx-runtime").JSX.Element;
