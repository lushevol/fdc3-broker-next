import MuiAdd from '@mui/icons-material/Add';
import MuiAdjust from '@mui/icons-material/Adjust';
import MuiArrowForwardIos from '@mui/icons-material/ArrowForwardIos';
import MuiBadgeOutlined from '@mui/icons-material/BadgeOutlined';
import MuiCallMade from '@mui/icons-material/CallMade';
import MuiCheckCircleOutlined from '@mui/icons-material/CheckCircleOutlined';
import MuiClose from '@mui/icons-material/Close';
import MuiContentPaste from '@mui/icons-material/ContentPaste';
import MuiDangerous from '@mui/icons-material/Dangerous';
import MuiDelete from '@mui/icons-material/Delete';
import MuiEdit from '@mui/icons-material/Edit';
import MuiExpandMore from '@mui/icons-material/ExpandMore';
import MuiHistory from '@mui/icons-material/History';
import MuiKeyboardArrowDown from '@mui/icons-material/KeyboardArrowDown';
import MuiLightMode from '@mui/icons-material/LightMode';
import MuiLockOutlined from '@mui/icons-material/LockOutlined';
import MuiMailOutline from '@mui/icons-material/MailOutline';
import MuiPersonOutlined from '@mui/icons-material/PersonOutlined';
import MuiPublishedWithChanges from '@mui/icons-material/PublishedWithChanges';
import MuiRadioButtonUnchecked from '@mui/icons-material/RadioButtonUnchecked';
import MuiRateReview from '@mui/icons-material/RateReview';
import MuiRefresh from '@mui/icons-material/Refresh';
import MuiUnpublished from '@mui/icons-material/Unpublished';
import MuiVerifiedUserOutlined from '@mui/icons-material/VerifiedUserOutlined';

// Vite may expose MUI's CommonJS icon module as the default import in linked packages.
function iconComponent<T>(icon: T): T {
  return 'default' in (icon as object) ? (icon as { default: T }).default : icon;
}

export const Add = iconComponent(MuiAdd);
export const Adjust = iconComponent(MuiAdjust);
export const ArrowForwardIos = iconComponent(MuiArrowForwardIos);
export const BadgeOutlined = iconComponent(MuiBadgeOutlined);
export const CallMade = iconComponent(MuiCallMade);
export const CheckCircleOutlined = iconComponent(MuiCheckCircleOutlined);
export const Close = iconComponent(MuiClose);
export const ContentPaste = iconComponent(MuiContentPaste);
export const Dangerous = iconComponent(MuiDangerous);
export const Delete = iconComponent(MuiDelete);
export const Edit = iconComponent(MuiEdit);
export const ExpandMore = iconComponent(MuiExpandMore);
export const History = iconComponent(MuiHistory);
export const KeyboardArrowDown = iconComponent(MuiKeyboardArrowDown);
export const LightMode = iconComponent(MuiLightMode);
export const LockOutlined = iconComponent(MuiLockOutlined);
export const MailOutline = iconComponent(MuiMailOutline);
export const PersonOutlined = iconComponent(MuiPersonOutlined);
export const PublishedWithChanges = iconComponent(MuiPublishedWithChanges);
export const RadioButtonUnchecked = iconComponent(MuiRadioButtonUnchecked);
export const RateReview = iconComponent(MuiRateReview);
export const Refresh = iconComponent(MuiRefresh);
export const Unpublished = iconComponent(MuiUnpublished);
export const VerifiedUserOutlined = iconComponent(MuiVerifiedUserOutlined);
