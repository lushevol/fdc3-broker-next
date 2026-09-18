import { legacyTokens } from "../tokens/legacy.js";
export interface LoginPageTokens {
  leftBackground: string;
  contentWidth: string;
  mutedText: string;
  inputText: string;
  headingFontSize: string;
  headingFontWeight: number;
  headingLineHeight: string;
  headingMarginBottom: string;
  formMarginBottom: string;
  labelFontSize: string;
  labelFontWeight: number;
  labelLineHeight: string;
  inputShadow: string;
  placeholderFontSize: string;
  placeholderLineHeight: string;
  buttonHeight: string;
  buttonFontSize: string;
  buttonFontWeight: number;
  buttonLineHeight: string;
  buttonMarginTop: string;
  heroBackground: string;
  heroHeight: string;
  heroTitleFontSize: string;
  heroTitleFontWeight: number;
  heroTitleLineHeight: string;
  heroTitleWidth: string;
  heroTitleMarginTop: string;
  heroContentMarginLeft: string;
  heroTitleMarginBottom: string;
  descriptionFontSize: string;
  descriptionFontWeight: number;
  descriptionLineHeight: string;
  descriptionWidth: string;
  tabsBottom: string;
  tabsRight: string;
  tabBorder: string;
  tabActive: string;
  tabIndicatorHeight: string;
  divider: string;
}

export const loginPage: LoginPageTokens = {
  leftBackground: "#040404",
  contentWidth: "306px",
  mutedText: "#bdbdbd",
  inputText: "#cbcbcb",
  headingFontSize: "2rem",
  headingFontWeight: 500,
  headingLineHeight: "48px",
  headingMarginBottom: "2.5rem",
  formMarginBottom: "2rem",
  labelFontSize: "0.875rem",
  labelFontWeight: 400,
  labelLineHeight: "21px",
  inputShadow: "0 4px 4px rgba(0, 0, 0, 0.25)",
  placeholderFontSize: "0.75rem",
  placeholderLineHeight: "18px",
  buttonHeight: "44px",
  buttonFontSize: "0.75rem",
  buttonFontWeight: 600,
  buttonLineHeight: "18px",
  buttonMarginTop: "1.25rem",
  heroBackground: "linear-gradient(135.03deg, #7a7979 -11.69%, #111112 51.68%)",
  heroHeight: "100vh",
  heroTitleFontSize: "1.125rem",
  heroTitleFontWeight: 600,
  heroTitleLineHeight: "32px",
  heroTitleWidth: "333px",
  heroTitleMarginTop: "220px",
  heroContentMarginLeft: "80px",
  heroTitleMarginBottom: "24px",
  descriptionFontSize: "0.875rem",
  descriptionFontWeight: 400,
  descriptionLineHeight: "21px",
  descriptionWidth: "45%",
  tabsBottom: "52px",
  tabsRight: "72px",
  tabBorder: "#606060",
  tabActive: "#ffffff",
  tabIndicatorHeight: "3px",
  divider: "rgba(65, 73, 85, 1)",
};

export default { ...legacyTokens, loginPage };
