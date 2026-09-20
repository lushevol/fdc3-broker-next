/* Generated from webkit-theme.json; do not edit. */
export const webkitReferences = {
  "color": {
    "background": "--sc-layout-background-color",
    "surface": "--sc-panel-background-color",
    "surfaceRaised": "--sc-card-background-color",
    "surfaceSelected": "--sc-card-selected-background",
    "text": "--sc-layout-text-color",
    "textHeading": "--sc-panel-title-color",
    "textMuted": "--sc-panel-content-color",
    "border": "--sc-divider-color",
    "borderInteractive": "--sc-card-hover-border-color",
    "focus": "--sc-focus-ring-color",
    "link": "--sc-link-primary-color",
    "linkHover": "--sc-link-hover-color",
    "icon": "--sc-icon-primary-color",
    "info": "--sc-status-info-icon",
    "success": "--sc-status-success-icon",
    "warning": "--sc-status-warning-icon",
    "danger": "--sc-status-danger-icon"
  },
  "typography": {
    "fontFamily": "--sc-font-family",
    "fontSize": "--sc-font-size"
  },
  "spacing": {
    "none": "--sc-spacing-0",
    "xsmall": "--sc-spacing-4",
    "small": "--sc-spacing-8",
    "medium": "--sc-spacing-16",
    "large": "--sc-spacing-24",
    "xlarge": "--sc-spacing-32"
  },
  "radius": {
    "none": "--sc-radius-none",
    "small": "--sc-radius-sm",
    "medium": "--sc-radius-md",
    "large": "--sc-radius-lg"
  },
  "shadow": {
    "color": "--sc-box-shadow-color",
    "focus": "--sc-data-grid-cell-focus-shadow"
  }
} as const;

export const webkitMuiTheme = {
  "typography": {
    "fontFamily": {
      "variable": "--sc-font-family",
      "value": "\"SC Prosper Sans\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, Helvetica, Arial, sans-serif, \"Apple Color Emoji\", \"Segoe UI Emoji\", \"Segoe UI Symbol\""
    },
    "fontSize": {
      "value": 14,
      "reason": "MUI requires a numeric rem-conversion baseline; component sizes use canonical CSS values."
    }
  },
  "shape": {
    "borderRadius": {
      "value": 6,
      "reason": "MUI requires a numeric base radius; component radii use canonical CSS references."
    }
  },
  "palette": {
    "light": {
      "primary": {
        "variable": "--sc-color-blue-500",
        "value": "#0473EA"
      },
      "secondary": {
        "variable": "--sc-color-blue-700",
        "value": "#02458C"
      },
      "error": {
        "variable": "--sc-color-red-500",
        "value": "#E00A15"
      },
      "warning": {
        "variable": "--sc-color-amber-500",
        "value": "#FAAD14"
      },
      "success": {
        "variable": "--sc-color-green-700",
        "value": "#207E00"
      },
      "backgroundDefault": {
        "variable": "--sc-color-grey-25",
        "value": "#F9F9F9"
      },
      "backgroundPaper": {
        "variable": "--sc-color-white",
        "value": "#FFFFFF"
      },
      "textPrimary": {
        "variable": "--sc-color-blue-900",
        "value": "#00172E"
      },
      "textSecondary": {
        "variable": "--sc-color-grey-650",
        "value": "#595959"
      }
    },
    "dark": {
      "primary": {
        "variable": "--sc-color-blue-500-dark",
        "value": "#0473EA"
      },
      "secondary": {
        "variable": "--sc-color-blue-700-dark",
        "value": "#68ABF2"
      },
      "error": {
        "variable": "--sc-color-red-650-dark",
        "value": "#E9545B"
      },
      "warning": {
        "variable": "--sc-color-amber-500-dark",
        "value": "#FAAD14"
      },
      "success": {
        "variable": "--sc-color-green-650-dark",
        "value": "#73E350"
      },
      "backgroundDefault": {
        "variable": "--sc-color-grey-100-dark",
        "value": "#1A1A1A"
      },
      "backgroundPaper": {
        "variable": "--sc-color-black",
        "value": "#000000"
      },
      "textPrimary": {
        "variable": "--sc-color-blue-900-dark",
        "value": "#CCE3FA"
      },
      "textSecondary": {
        "variable": "--sc-color-grey-700-dark",
        "value": "#B2B2B2"
      }
    }
  }
} as const;
