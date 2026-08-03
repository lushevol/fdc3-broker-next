import { html, nothing, TemplateResult } from 'lit';
import { property, state } from 'lit/decorators.js';
import {
  HttpAgent,
  AgentSubscriber,
  Interrupt,
  ResumeEntry,
  RunErrorEvent,
  RunFinishedEvent,
  RunStartedEvent,
  StateSnapshotEvent,
  TextMessageContentEvent,
  TextMessageStartEvent,
} from '@ag-ui/client';
import ScExtElement from '../../shared/sc-ext-element.js';
import { ScChatBox } from './ScChatBox.js';
import { ScChatInput } from './ScChatInput.js';
import ScChatStyle from './ScChat.style.js';
import {
  agUiAdapter,
  createAgUiRuntimeAgent,
  executeAgUiRuntimeRun,
} from './adapters/agUiAdapter.js';
import { legacyGraphqlAdapter } from './adapters/legacyGraphqlAdapter.js';
import type { Message } from '@ag-ui/core';
import type {
  AdapterClients,
  ChatApiAdapter,
  ChatProtocol,
  SetupAiModelsResult,
} from './adapters/types.js';
import type { ChatAction, ChatConversation } from './types.js';

type RuntimeMessageRole = 'assistant' | 'user' | 'system' | 'tool' | 'activity' | 'reasoning' | 'developer';

type RuntimeMessage = {
  id: string;
  role: RuntimeMessageRole;
  content: string;
};

type JsonObject = Record<string, unknown>;

type RequestMessageRole = 'assistant' | 'user' | 'system';

type RequestMessage = {
  id: string;
  role: RequestMessageRole;
  content: string;
};

type InterruptSchemaProperty = {
  description?: string;
};

type InterruptSchema = {
  properties?: Record<string, InterruptSchemaProperty>;
};

type RunSnapshot = JsonObject & {
  threadId?: string;
  runId?: string;
  pendingInterrupts?: unknown[];
};

type InterruptField = {
  fieldName: string;
  label?: string;
  description?: string;
};

type InterruptWidget = {
  interruptId?: string;
  message?: string;
  props?: {
    label?: string;
    description?: string;
    fields?: InterruptField[];
  };
};

const DEFAULT_VERSION = '1.0';

const chatAvatar = html`<svg viewBox="0 0 300 300" fill="none" xmlns="http://www.w3.org/2000/svg">
<path fill-rule="evenodd" clip-rule="evenodd" d="M121.446 56.3007C116.722 57.5666 113.918 62.4224 115.184 67.1466C116.45 71.8707 121.306 74.6742 126.03 73.4084C130.754 72.1426 133.557 67.2867 132.292 62.5626C131.026 57.8384 126.17 55.0349 121.446 56.3007ZM96.2804 72.2117C92.2171 57.0475 101.216 41.4605 116.381 37.3972C131.545 33.334 147.132 42.3331 151.195 57.4974C155.258 72.6617 146.259 88.2486 131.095 92.3119C115.931 96.3752 100.344 87.376 96.2804 72.2117Z" fill="#38D200"/>
<path fill-rule="evenodd" clip-rule="evenodd" d="M128.978 77.9713C134.198 76.5726 139.564 79.6704 140.962 84.8905L147.117 107.858C148.515 113.078 145.418 118.444 140.197 119.843C134.977 121.241 129.612 118.143 128.213 112.923L122.059 89.9557C120.66 84.7356 123.758 79.37 128.978 77.9713Z" fill="#38D200"/>
<g filter="url(#filter0_f_239_7029)">
<path d="M67.7762 196.094C67.7762 151.185 104.182 114.779 149.091 114.779V114.779C194 114.779 230.406 151.185 230.406 196.094V206.739C230.406 216.262 222.686 223.981 213.163 223.981H85.0188C75.496 223.981 67.7762 216.262 67.7762 206.739V196.094Z" fill="#00D1FF"/>
</g>
<path d="M67.7765 196.094C67.7765 151.185 104.182 114.779 149.091 114.779V114.779C194 114.779 230.406 151.185 230.406 196.094V206.739C230.406 216.262 222.686 223.981 213.164 223.981H85.019C75.4962 223.981 67.7765 216.262 67.7765 206.739V196.094Z" fill="#0473EA"/>
<path d="M67.7765 196.094C67.7765 151.185 104.182 114.779 149.091 114.779V114.779C194 114.779 230.406 151.185 230.406 196.094V206.739C230.406 216.262 222.686 223.981 213.164 223.981H85.019C75.4962 223.981 67.7765 216.262 67.7765 206.739V196.094Z" fill="#0473EA"/>
<path fill-rule="evenodd" clip-rule="evenodd" d="M42.5307 160.651C47.9349 160.651 52.3158 160.747 52.3158 166.151V205.291C52.3158 210.696 47.9349 210.791 42.5307 210.791C37.1265 210.791 32.7455 205.761 32.7455 200.357V171.428C32.7455 166.024 37.1265 160.651 42.5307 160.651Z" fill="#0C3A66"/>
<path fill-rule="evenodd" clip-rule="evenodd" d="M255.745 160.651C250.341 160.651 245.96 160.747 245.96 166.151V205.291C245.96 210.696 250.341 210.791 255.745 210.791C261.149 210.791 265.53 205.761 265.53 200.357V171.428C265.53 166.024 261.149 160.651 255.745 160.651Z" fill="#0C3A66"/>
<path fill-rule="evenodd" clip-rule="evenodd" d="M57.9908 196.094C57.9908 145.78 98.7779 104.993 149.091 104.993C199.405 104.993 240.192 145.78 240.192 196.094V206.739C240.192 221.666 228.091 233.767 213.164 233.767H85.019C70.0918 233.767 57.9908 221.666 57.9908 206.739V196.094ZM149.091 124.565C109.587 124.565 77.5622 156.589 77.5622 196.094V206.739C77.5622 210.857 80.9007 214.196 85.019 214.196H213.164C217.282 214.196 220.62 210.857 220.62 206.739V196.094C220.62 156.589 188.596 124.565 149.091 124.565Z" fill="#0473EA"/>
<path fill-rule="evenodd" clip-rule="evenodd" d="M137.5 144C144.127 144 149.5 149.357 149.5 155.966V167.275C149.5 173.884 144.127 174 137.5 174C130.873 174 125.5 173.884 125.5 167.275V155.966C125.5 149.357 130.873 144 137.5 144Z" fill="white"/>
<path fill-rule="evenodd" clip-rule="evenodd" d="M197 145C202.523 145 207 150.179 207 156.567V167.499C207 173.887 202.523 174 197 174C191.477 174 187 173.887 187 167.499V156.567C187 150.179 191.477 145 197 145Z" fill="white"/>
<g clip-path="url(#clip0_239_7029)">
<path d="M239.422 20.697C257.816 20.697 272.745 36.2598 272.745 55.4734C272.745 74.6869 257.816 90.2488 239.422 90.2488H238.721L218.554 104.264C216.222 105.885 213.114 104.123 213.114 101.179V89.0017C198.818 84.9472 188.561 71.3408 188.561 55.4734C188.561 36.2598 203.49 20.697 221.884 20.697H239.422Z" fill="#E7F1FD"/>
</g>
<path d="M258.459 20.3378C259.103 18.5966 261.566 18.5966 262.21 20.3378L263.436 23.6511C263.639 24.1986 264.07 24.6302 264.618 24.8327L267.931 26.0588C269.672 26.7031 269.672 29.1659 267.931 29.8102L264.618 31.0362C264.07 31.2388 263.639 31.6704 263.436 32.2179L262.21 35.5312C261.566 37.2724 259.103 37.2724 258.459 35.5312L257.233 32.2179C257.03 31.6704 256.598 31.2388 256.051 31.0362L252.738 29.8102C250.996 29.1659 250.996 26.7031 252.738 26.0588L256.051 24.8327C256.598 24.6302 257.03 24.1986 257.233 23.6511L258.459 20.3378Z" fill="#F5C000"/>
<path d="M229.81 38.4317C230.455 36.6904 232.917 36.6904 233.562 38.4317L237.15 48.1283C237.352 48.6757 237.784 49.1074 238.331 49.3099L248.028 52.898C249.769 53.5423 249.769 56.0051 248.028 56.6494L238.331 60.2375C237.784 60.4401 237.352 60.8717 237.15 61.4191L233.562 71.1157C232.917 72.857 230.455 72.857 229.81 71.1157L226.222 61.4191C226.02 60.8717 225.588 60.4401 225.041 60.2375L215.344 56.6494C213.603 56.0051 213.603 53.5423 215.344 52.898L225.041 49.3099C225.588 49.1074 226.02 48.6757 226.222 48.1283L229.81 38.4317Z" fill="#F5C000"/>
<defs>
<filter id="filter0_f_239_7029" x="62.2762" y="109.279" width="173.63" height="120.203" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
<feFlood flood-opacity="0" result="BackgroundImageFix"/>
<feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
<feGaussianBlur stdDeviation="2.75" result="effect1_foregroundBlur_239_7029"/>
</filter>
<clipPath id="clip0_239_7029">
<rect width="84.1845" height="84.1845" fill="white" transform="translate(188.561 20.697)"/>
</clipPath>
</defs>
</svg>
`;
const yodaChatAvatar = html`<svg width="22" height="23" viewBox="0 0 22 23" fill="none" xmlns="http://www.w3.org/2000/svg">
<circle cx="11" cy="11" r="11" fill="url(#paint0_linear_14223_88771)"/>
<path d="M11.7301 5.54166C11.7588 5.54696 11.7588 5.54696 11.7881 5.55235C12.6051 5.70857 13.3682 6.06939 13.9646 6.65462C13.9959 6.68525 14.0277 6.71531 14.0596 6.74534C14.319 6.9946 14.5611 7.29925 14.7227 7.62245C14.8184 7.60875 14.8765 7.5575 14.9521 7.49969C15.7884 6.88353 16.7872 6.58642 17.8088 6.47684C17.8283 6.47464 17.8479 6.47242 17.8681 6.47011C18.0451 6.45175 18.222 6.44756 18.3999 6.44657C18.4337 6.44629 18.4676 6.44581 18.5015 6.44514C18.5511 6.44413 18.6007 6.44377 18.6504 6.44352C18.6942 6.443 18.6942 6.443 18.7389 6.44249C18.8141 6.45346 18.8141 6.45346 18.8702 6.49485C18.9223 6.56751 18.9231 6.6119 18.9189 6.69921C18.8973 6.81073 18.8378 6.89933 18.7776 6.99412C18.7639 7.01633 18.7504 7.03851 18.7363 7.06138C18.6085 7.26829 18.4752 7.47187 18.3413 7.67486C18.2527 7.80929 18.1666 7.94518 18.0806 8.08127C17.8902 8.38113 17.6938 8.66559 17.4581 8.9317C17.447 8.94423 17.436 8.95676 17.4246 8.96967C17.296 9.11475 17.1658 9.25478 17.0139 9.37591C16.9933 9.39242 16.9727 9.40895 16.9515 9.42596C16.5921 9.70509 16.1981 9.88715 15.7674 10.0262C15.7465 10.0329 15.7256 10.0397 15.7041 10.0467C15.5578 10.0924 15.4117 10.1232 15.2604 10.1474C15.2555 10.1653 15.2506 10.1832 15.2455 10.2016C15.0389 10.9468 14.7972 11.5437 14.2551 12.1113C14.227 12.1413 14.227 12.1413 14.1983 12.1719C13.9605 12.4186 13.6889 12.622 13.3901 12.7893C13.3722 12.7993 13.3544 12.8093 13.3361 12.8197C12.9047 13.0595 12.4702 13.2253 11.9873 13.3271C11.9699 13.3309 11.9526 13.3348 11.9347 13.3388C11.6261 13.4048 11.3136 13.4045 10.9995 13.406C10.9785 13.4061 10.9576 13.4063 10.936 13.4065C10.6548 13.4084 10.3918 13.386 10.1169 13.3271C10.0939 13.3224 10.0709 13.3178 10.0471 13.313C9.03379 13.1032 8.03443 12.5528 7.42389 11.6978C7.39329 11.6491 7.36361 11.5999 7.33476 11.5502C7.3256 11.5352 7.31645 11.5201 7.30701 11.5046C7.05543 11.0902 6.87167 10.628 6.79703 10.1474C6.78424 10.1446 6.77143 10.1418 6.75826 10.1389C6.46717 10.0743 6.18618 9.99953 5.90861 9.89026C5.89285 9.88418 5.87711 9.87809 5.86086 9.87183C5.25733 9.63584 4.75496 9.18622 4.36555 8.67452C4.3444 8.64736 4.3444 8.64736 4.32282 8.61964C4.19962 8.45633 4.09176 8.28339 3.98269 8.1105C3.89677 7.9743 3.80956 7.83908 3.7209 7.70465C3.10597 6.77173 3.10597 6.77173 3.12643 6.57038C3.17388 6.50093 3.2115 6.45977 3.29606 6.44304C3.36363 6.43922 3.42995 6.43976 3.49758 6.44178C3.53597 6.44245 3.53597 6.44245 3.57511 6.44314C4.90556 6.47767 6.2057 6.80196 7.29055 7.59404C7.33255 7.62667 7.33255 7.62667 7.38151 7.62245C7.41944 7.56563 7.45484 7.50873 7.48964 7.45003C7.6274 7.22392 7.78689 7.02863 7.96545 6.8333C8.00281 6.79184 8.03809 6.74999 8.07266 6.70626C8.14722 6.62025 8.22904 6.54924 8.31669 6.47684C8.33981 6.45753 8.36292 6.43821 8.38675 6.41831C9.31346 5.65817 10.5447 5.3219 11.7301 5.54166Z" fill="#38D200"/>
<path d="M9.70244 7.35616C9.7344 7.35608 9.76635 7.35594 9.79832 7.3558C9.88405 7.35548 9.96978 7.3556 10.0555 7.35582C10.146 7.356 10.2364 7.35584 10.3268 7.35572C10.4786 7.3556 10.6303 7.35576 10.7821 7.3561C10.9566 7.35649 11.1312 7.35637 11.3058 7.35598C11.4566 7.35566 11.6074 7.35562 11.7582 7.3558C11.8479 7.3559 11.9375 7.35592 12.0272 7.35568C12.1115 7.35548 12.1959 7.35564 12.2803 7.35602C12.3254 7.35616 12.3705 7.35596 12.4156 7.35574C12.9041 7.35921 13.366 7.50199 13.7212 7.84745C14.1009 8.23402 14.24 8.72543 14.2398 9.2537C14.2399 9.30656 14.2408 9.35935 14.2417 9.41219C14.2459 9.96216 14.0688 10.4424 13.6862 10.8429C13.2998 11.217 12.7977 11.3589 12.2716 11.3673C12.2468 11.3677 12.2468 11.3677 12.2216 11.3681C12.1527 11.3692 12.0839 11.3703 12.015 11.3708C11.7607 11.3726 11.5807 11.3882 11.3876 11.5736C11.0757 11.8641 10.7604 12.1366 10.3736 12.3217C10.3729 12.2817 10.3729 12.2817 10.3721 12.2409C10.3704 12.1422 10.3683 12.0434 10.3661 11.9447C10.3652 11.9019 10.3644 11.8592 10.3637 11.8164C10.3626 11.755 10.3613 11.6936 10.3599 11.6322C10.3596 11.613 10.3593 11.5938 10.359 11.574C10.3605 11.4692 10.3605 11.4692 10.3034 11.3865C10.2296 11.3797 10.2296 11.3797 10.1422 11.381C10.1087 11.3807 10.0751 11.3804 10.0416 11.3801C10.024 11.38 10.0064 11.3799 9.98821 11.3797C9.3769 11.3739 8.8167 11.2704 8.36292 10.8254C7.89426 10.318 7.80581 9.73749 7.8221 9.07158C7.8442 8.57111 8.0655 8.10149 8.43305 7.76269C8.79579 7.4543 9.23596 7.3539 9.70244 7.35616Z" fill="#FAFBFB"/>
<path d="M7.86129 12.6958C7.41914 12.8472 7.09991 13.3734 6.90271 13.7712C6.58851 14.4376 6.50017 15.2003 6.37756 15.9191C6.36452 15.9951 6.35121 16.071 6.33789 16.1469C6.32925 16.1971 6.32058 16.2472 6.31193 16.2974C6.30429 16.3405 6.3204 16.3844 6.35392 16.4124C6.48423 16.5214 6.48423 16.5214 6.48423 16.5214L6.63577 16.6325L6.84794 16.784C6.84794 16.784 6.92185 16.8454 7.3935 17.1376C8.32298 17.7135 7.64608 17.2993 8.65638 17.9055C8.65638 17.9055 10.1677 18.7339 10.3597 18.5117C10.6426 18.2793 10.5971 17.764 10.5967 16.8807C10.598 16.5188 10.5982 16.1569 10.5971 15.795C10.5968 15.7031 10.5967 15.6113 10.597 15.5194C10.5991 14.819 10.5991 14.819 10.3597 14.5586C10.2081 14.4226 10.0263 14.32 9.85428 14.2122C9.5585 14.0267 9.27105 13.8289 8.9835 13.631C8.96289 13.6168 8.94226 13.6026 8.92102 13.588C8.63207 13.3884 8.35127 13.1817 8.09215 12.9442C8.0797 12.9328 8.06725 12.9214 8.05442 12.9096C7.98309 12.8429 7.92035 12.7735 7.86129 12.6958Z" fill="#38D200"/>
<path d="M14.1446 12.6958C14.5867 12.8472 14.9059 13.3734 15.1031 13.7712C15.4173 14.4376 15.5057 15.2003 15.6283 15.9191C15.6413 15.9951 15.6546 16.071 15.668 16.1469C15.6766 16.1971 15.6853 16.2472 15.6939 16.2974C15.7016 16.3405 15.6855 16.3844 15.6519 16.4124C15.5216 16.5214 15.5216 16.5214 15.5216 16.5214L15.3701 16.6325L15.1579 16.784C15.1579 16.784 15.084 16.8454 14.6124 17.1376C13.6829 17.7135 14.3598 17.2993 13.3495 17.9055C13.3495 17.9055 11.8381 18.7339 11.6462 18.5117C11.3633 18.2793 11.4088 17.764 11.4092 16.8807C11.4078 16.5188 11.4076 16.1569 11.4088 15.795C11.4091 15.7031 11.4092 15.6113 11.4088 15.5194C11.4068 14.819 11.4068 14.819 11.6462 14.5586C11.7977 14.4226 11.9795 14.32 12.1516 14.2122C12.4474 14.0267 12.7348 13.8289 13.0224 13.631C13.043 13.6168 13.0636 13.6026 13.0848 13.588C13.3738 13.3884 13.6546 13.1817 13.9137 12.9442C13.9262 12.9328 13.9386 12.9214 13.9514 12.9096C14.0228 12.8429 14.0855 12.7735 14.1446 12.6958Z" fill="#38D200"/>
<path d="M8.09522 12.3918C8.03279 12.4495 7.97679 12.5119 7.9228 12.5774C7.91009 12.5926 7.89736 12.6077 7.88427 12.6234C7.86144 12.6724 7.86144 12.6724 7.87477 12.73C7.99641 12.9458 8.23481 13.1017 8.42901 13.2494C8.46574 13.2775 8.50193 13.3064 8.53806 13.3353C8.76803 13.5182 9.01397 13.677 9.25913 13.8385C9.38241 13.9199 9.5052 14.0019 9.62804 14.0839C9.88298 14.2541 9.88298 14.2541 10.0037 14.3335C10.0197 14.3441 10.0357 14.3547 10.0522 14.3656C10.0807 14.3844 10.1092 14.4031 10.1377 14.4217C10.3436 14.5577 10.4882 14.6976 10.5501 14.9402C10.5747 15.1139 10.5722 15.2901 10.5726 15.4653C10.573 15.6312 10.5761 15.797 10.5796 15.9628C10.5808 16.0197 10.5819 16.0765 10.5831 16.1334C10.584 16.1759 10.584 16.1759 10.5849 16.2192C10.5893 16.4397 10.593 16.6602 10.5968 16.8807C10.9903 16.8692 10.9903 16.8692 11.3917 16.8574C11.3923 16.727 11.3929 16.5967 11.3936 16.4624C11.3941 16.3794 11.3948 16.2963 11.3955 16.2134C11.3966 16.0819 11.3976 15.9504 11.3981 15.8189C11.3984 15.7128 11.3992 15.6067 11.4004 15.5005C11.4007 15.4602 11.4009 15.4199 11.4009 15.3796C11.4012 15.0592 11.4283 14.8123 11.6617 14.5722C11.7932 14.4511 11.9436 14.3615 12.0945 14.2669C12.1124 14.2557 12.1302 14.2445 12.1486 14.233C12.1764 14.2156 12.1764 14.2156 12.2047 14.1979C12.605 13.9459 12.9978 13.6773 13.379 13.3972C13.403 13.3796 13.4269 13.362 13.4516 13.3439C13.7015 13.1587 13.9342 12.9665 14.1505 12.7425C14.166 12.7271 14.1814 12.7117 14.1973 12.6958C14.1809 12.6876 14.1645 12.6794 14.1476 12.671C14.073 12.6206 14.0264 12.5656 13.9713 12.4953C13.9558 12.4788 13.9558 12.4788 13.9401 12.462C13.9247 12.462 13.9092 12.462 13.8933 12.462C13.8933 12.4774 13.8933 12.4929 13.8933 12.5088C13.8695 12.5102 13.8695 12.5102 13.8451 12.5117C13.7487 12.5404 13.6806 12.5987 13.6128 12.6724C13.6128 12.6878 13.6128 12.7033 13.6128 12.7192C13.5993 12.7217 13.5859 12.7242 13.5721 12.7267C13.5118 12.7448 13.4736 12.7713 13.4228 12.8083C13.3132 12.884 13.2002 12.932 13.0751 12.9763C13.0751 12.9918 13.0751 13.0072 13.0751 13.0231C13.0519 13.025 13.0288 13.027 13.0049 13.0289C12.9203 13.0409 12.8565 13.0736 12.7812 13.1141C12.6854 13.1578 12.5842 13.1823 12.4826 13.2095C12.4197 13.2272 12.3588 13.2462 12.2971 13.2675C11.8779 13.4079 11.4633 13.4317 11.025 13.4308C11.0018 13.4308 10.9786 13.4308 10.9548 13.4308C10.6009 13.43 10.2625 13.4025 9.91591 13.327C9.89728 13.3232 9.87865 13.3193 9.85946 13.3153C9.76552 13.2953 9.68019 13.2711 9.59152 13.2335C9.55976 13.223 9.52794 13.2126 9.49607 13.2024C9.06105 13.0587 8.64871 12.8698 8.28482 12.5898C8.23551 12.5555 8.23551 12.5555 8.18874 12.5555C8.18874 12.5401 8.18874 12.5247 8.18874 12.5088C8.15402 12.4856 8.15402 12.4856 8.1186 12.462C8.11088 12.4388 8.10318 12.4157 8.09522 12.3918Z" fill="#207E00"/>
<path d="M9.64866 10.0421C9.98345 10.0421 10.2548 9.77068 10.2548 9.43589C10.2548 9.10111 9.98345 8.82971 9.64866 8.82971C9.31388 8.82971 9.04248 9.10111 9.04248 9.43589C9.04248 9.77068 9.31388 10.0421 9.64866 10.0421Z" fill="#0473EA"/>
<path d="M12.4162 10.0421C12.751 10.0421 13.0224 9.77068 13.0224 9.43589C13.0224 9.10111 12.751 8.82971 12.4162 8.82971C12.0815 8.82971 11.8101 9.10111 11.8101 9.43589C11.8101 9.77068 12.0815 10.0421 12.4162 10.0421Z" fill="#0473EA"/>
<defs>
<linearGradient id="paint0_linear_14223_88771" x1="0" y1="11" x2="22" y2="11" gradientUnits="userSpaceOnUse">
<stop stop-color="#2C3A88"/>
<stop offset="1" stop-color="#0061C8"/>
</linearGradient>
</defs>
</svg>
`;
const xbkChatAvatar = html`<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48" fill="none">
<path d="M48 24C48 10.7452 37.2548 0 24 0C10.7452 0 0 10.7452 0 24C0 37.2548 10.7452 48 24 48C37.2548 48 48 37.2548 48 24Z" fill="#E7F1FD"/>
<path fill-rule="evenodd" clip-rule="evenodd" d="M23.8782 8.95982C23.0957 8.95982 22.4613 9.59419 22.4613 10.3767C22.4613 11.1592 23.0957 11.7936 23.8782 11.7936C24.6608 11.7936 25.2951 11.1592 25.2951 10.3767C25.2951 9.59419 24.6608 8.95982 23.8782 8.95982ZM19.3301 10.3767C19.3301 7.86484 21.3664 5.82857 23.8782 5.82857C26.3901 5.82857 28.4264 7.86484 28.4264 10.3767C28.4264 12.8886 26.3901 14.9249 23.8782 14.9249C21.3664 14.9249 19.3301 12.8886 19.3301 10.3767Z" fill="#38D200"/>
<path fill-rule="evenodd" clip-rule="evenodd" d="M23.8542 12.3573C24.7189 12.3573 25.4198 13.0582 25.4198 13.9229L25.4198 17.7274C25.4198 18.592 24.7189 19.293 23.8542 19.293C22.9895 19.293 22.2886 18.592 22.2886 17.7274L22.2886 13.9229C22.2886 13.0582 22.9895 12.3573 23.8542 12.3573Z" fill="#38D200"/>
<path d="M18.9154 18.4063C19.8078 17.8532 20.0969 16.6591 19.3518 15.9194C19.1921 15.7609 19.0263 15.6098 18.8549 15.4669C18.2056 14.9256 17.4893 14.512 16.747 14.2497C16.0047 13.9875 15.2508 13.8817 14.5285 13.9385C13.8062 13.9953 13.1295 14.2134 12.5372 14.5806C11.9448 14.9477 11.4483 15.4566 11.0761 16.0783C10.7039 16.6999 10.4632 17.4221 10.3678 18.2036C10.2724 18.985 10.3241 19.8105 10.52 20.6329C10.5717 20.8499 10.6332 21.0657 10.7042 21.2792C11.0351 22.2756 12.2331 22.548 13.1255 21.9949L18.9154 18.4063Z" fill="#2B2B2B"/>
<path d="M28.967 18.4063C28.0747 17.8532 27.7856 16.6591 28.5307 15.9194C28.6904 15.7609 28.8562 15.6098 29.0276 15.4669C29.6769 14.9256 30.3931 14.512 31.1355 14.2497C31.8778 13.9875 32.6316 13.8817 33.3539 13.9385C34.0763 13.9953 34.7529 14.2134 35.3453 14.5806C35.9377 14.9477 36.4341 15.4567 36.8063 16.0783C37.1786 16.6999 37.4193 17.4221 37.5147 18.2036C37.6101 18.985 37.5584 19.8105 37.3624 20.6329C37.3107 20.8499 37.2492 21.0657 37.1783 21.2792C36.8474 22.2756 35.6494 22.548 34.757 21.9949L28.967 18.4063Z" fill="#2B2B2B"/>
<path d="M10.8442 31.375C10.8442 24.1896 16.6692 18.3646 23.8546 18.3646C31.04 18.3646 36.865 24.1896 36.865 31.375V33.0782C36.865 34.6019 35.6298 35.837 34.1062 35.837H13.603C12.0794 35.837 10.8442 34.6019 10.8442 33.0782V31.375Z" fill="#00D1FF"/>
<path d="M10.8442 31.375C10.8442 24.1896 16.6692 18.3646 23.8546 18.3646C31.04 18.3646 36.865 24.1896 36.865 31.375V33.0782C36.865 34.6019 35.6298 35.837 34.1062 35.837H13.603C12.0794 35.837 10.8442 34.6019 10.8442 33.0782V31.375Z" fill="#0473EA"/>
<path d="M10.8442 31.375C10.8442 24.1896 16.6692 18.3646 23.8546 18.3646C31.04 18.3646 36.865 24.1896 36.865 31.375V33.0782C36.865 34.6019 35.6298 35.837 34.1062 35.837H13.603C12.0794 35.837 10.8442 34.6019 10.8442 33.0782V31.375Z" fill="white"/>
<path fill-rule="evenodd" clip-rule="evenodd" d="M6.80489 25.7042C7.66956 25.7042 8.37051 25.7194 8.37051 26.5841V32.8466C8.37051 33.7113 7.66956 33.7265 6.80489 33.7265C5.94021 33.7265 5.23926 32.9218 5.23926 32.0571V27.4285C5.23926 26.5639 5.94021 25.7042 6.80489 25.7042Z" fill="#0C3A66"/>
<path fill-rule="evenodd" clip-rule="evenodd" d="M40.9192 25.7042C40.0546 25.7042 39.3536 25.7194 39.3536 26.5841V32.8466C39.3536 33.7113 40.0546 33.7265 40.9192 33.7265C41.7839 33.7265 42.4849 32.9218 42.4849 32.0571V27.4285C42.4849 26.5639 41.7839 25.7042 40.9192 25.7042Z" fill="#0C3A66"/>
<path fill-rule="evenodd" clip-rule="evenodd" d="M9.27832 31.375C9.27832 23.3249 15.8042 16.7989 23.8544 16.7989C31.9045 16.7989 38.4305 23.3249 38.4305 31.375V33.0782C38.4305 35.4666 36.4943 37.4027 34.106 37.4027H13.6028C11.2145 37.4027 9.27832 35.4666 9.27832 33.0782V31.375ZM23.8544 19.9303C17.5337 19.9303 12.4097 25.0543 12.4097 31.375V33.0782C12.4097 33.7372 12.9439 34.2713 13.6028 34.2713H34.106C34.7649 34.2713 35.2991 33.7372 35.2991 33.0782V31.375C35.2991 25.0543 30.1751 19.9303 23.8544 19.9303Z" fill="#3B3B3B"/>
<path fill-rule="evenodd" clip-rule="evenodd" d="M19.2336 27C20.0983 27 20.7992 27.701 20.7992 28.5656V30.0452C20.7992 30.9099 20.0983 31.2857 19.2336 31.2857C18.3689 31.2857 17.668 30.9099 17.668 30.0452V28.5656C17.668 27.701 18.3689 27 19.2336 27Z" fill="#3B3B3B"/>
<path fill-rule="evenodd" clip-rule="evenodd" d="M28.3059 27C29.1705 27 29.8715 27.701 29.8715 28.5656V30.0452C29.8715 30.9099 29.1705 31.2857 28.3059 31.2857C27.4412 31.2857 26.7402 30.9099 26.7402 30.0452V28.5656C26.7402 27.701 27.4412 27 28.3059 27Z" fill="#3B3B3B"/>
<path d="M24.3323 30.9491C24.1494 31.2659 23.6921 31.2659 23.5091 30.9491L22.9604 29.9986C22.7775 29.6817 23.0061 29.2857 23.372 29.2857L24.4695 29.2857C24.8353 29.2857 25.064 29.6817 24.8811 29.9986L24.3323 30.9491Z" fill="#3B3B3B"/>
<path d="M11.2788 31.6573C10.5097 31.965 10.1355 32.838 10.4432 33.6071C10.7509 34.3763 11.6238 34.7504 12.393 34.4428L14.6072 33.5571C15.3764 33.2494 15.7505 32.3765 15.4428 31.6073C15.1352 30.8381 14.2622 30.464 13.493 30.7717L11.2788 31.6573Z" fill="#3B3B3B"/>
<path d="M36.7212 31.6573C37.4903 31.965 37.8645 32.838 37.5568 33.6071C37.2491 34.3763 36.3762 34.7504 35.607 34.4428L33.3928 33.5571C32.6236 33.2494 32.2495 32.3765 32.5572 31.6073C32.8648 30.8381 33.7378 30.464 34.507 30.7717L36.7212 31.6573Z" fill="#3B3B3B"/>
<path d="M27.1571 19.2789C27.4648 18.5097 28.3377 18.1356 29.1069 18.4433C29.8761 18.7509 30.2502 19.6239 29.9426 20.3931L29.0569 22.6073C28.7492 23.3765 27.8762 23.7506 27.1071 23.4429C26.3379 23.1352 25.9638 22.2623 26.2714 21.4931L27.1571 19.2789Z" fill="#3B3B3B"/>
<path d="M20.8424 19.2789C20.5347 18.5097 19.6618 18.1356 18.8926 18.4433C18.1234 18.7509 17.7493 19.6239 18.057 20.3931L18.9426 22.6073C19.2503 23.3765 20.1233 23.7506 20.8924 23.4429C21.6616 23.1352 22.0357 22.2623 21.7281 21.4931L20.8424 19.2789Z" fill="#3B3B3B"/>
<path d="M22.5 19.5C22.5 18.6716 23.1716 18 24 18C24.8284 18 25.5 18.6716 25.5 19.5L25.5 21.5C25.5 22.3284 24.8284 23 24 23C23.1716 23 22.5 22.3284 22.5 21.5L22.5 19.5Z" fill="#3B3B3B"/>
<path d="M11.5 30C10.6716 30 10 29.3284 10 28.5C10 27.6716 10.6716 27 11.5 27L13.5 27C14.3284 27 15 27.6716 15 28.5C15 29.3284 14.3284 30 13.5 30L11.5 30Z" fill="#3B3B3B"/>
<path d="M36.5 30C37.3284 30 38 29.3284 38 28.5C38 27.6716 37.3284 27 36.5 27L34.5 27C33.6716 27 33 27.6716 33 28.5C33 29.3284 33.6716 30 34.5 30L36.5 30Z" fill="#3B3B3B"/>
</svg>`;

const DEFAULT_CHAT_PROTOCOL: ChatProtocol = 'ag-ui';
const WAITING_TIME = 10000;
const WAITING_THRESHOLD_TIME = 5 * 60000;

const avatarMapping: Record<string, TemplateResult<1>> = {
  YODA: yodaChatAvatar,
  YODA_SEARCH: yodaChatAvatar,
  YODA_KMS: yodaChatAvatar,
  XBK: xbkChatAvatar,
  CAT: chatAvatar,
};

const INITIAL_CONVERSATION: ChatConversation[] = [
  { user: 'bot', text: 'Hello, I\'m ready to assist you. Ask me anything.', id: 'start' },
];

type ChatUiStatus = 'idle' | 'streaming' | 'interrupted' | 'resuming' | 'success' | 'completed' | 'error' | 'cancelled';

type ChatHeaderActionConfig = {
  id?: string;
  label?: string;
  icon?: string;
  iconSize?: 'xs' | 'sm' | 'md' | 'lg';
  title?: string;
  disabled?: boolean;
  buttonType?: 'primary' | 'secondary' | 'tertiary';
  leftIcon?: string;
  rightIcon?: string;
  eventName?: string;
  eventDetail?: Record<string, any>;
  handler?: (payload: { action: ChatHeaderActionConfig; component: ScChat }) => void;
};

export class ScChat extends ScExtElement {
  static get scopedElements() {
    return {
      'sc-chat-box': ScChatBox,
      'sc-chat-input': ScChatInput,
    };
  }

  static styles = [ScChatStyle];

  @property({ type: Object }) settings: Record<string, any> = {};
  @property({ type: Array }) data: ChatConversation[] = [];
  @property({ type: Object }) metadata: Record<string, any> = {};
  @property({ type: Boolean, attribute: 'disable-api' }) disableApi = false;
  @property({ type: Boolean, attribute: 'show-log' }) showLog = false;

  @state() sourceMap: Record<string, any> = {};
  @state() sources: Array<{ id: string; name: string }> = [];
  @state() selectedSource = '';
  @state() conversationId = '';
  @state() chatConversations: ChatConversation[] = [];
  @state() inputText = '';
  @state() processing = false;
  @state() uiStatus: ChatUiStatus = 'idle';
  @state() private _runtimeMessages: RuntimeMessage[] = [];
  @state() private _runtimeRawEvents: JsonObject[] = [];
  @state() private _runtimePendingInterrupts: Interrupt[] = [];
  @state() private _runtimePendingInterruptWidget: InterruptWidget | null = null;
  @state() private _runtimeInterruptValues: Record<string, string> = {};
  @state() private _runtimeLatestSnapshot: RunSnapshot | null = null;

  private _queryClient: { abort?: () => void } | null = null;
  private _queryTimer: ReturnType<typeof setTimeout> | null = null;
  private _runStartAt: number | null = null;
  private _lastSubmittedText = '';
  private _lastRunId = '';
  private _runtimeAgent: HttpAgent | null = null;

  connectedCallback() {
    super.connectedCallback();
    void this.initializeChat();
  }

  protected updated(changedProperties: Map<string, unknown>) {
    super.updated(changedProperties);
    if (changedProperties.has('data')) {
      this.chatConversations = this.getDisplayConversations();
      this.scrollContent(0);
    }
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this._runtimeResetAgentState();
    this.cleanPreviousCall();
  }

  private createId() {
    if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
      return crypto.randomUUID();
    }
    return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
  }

  private _createRuntimeId(prefix: string) {
    if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
      return `${prefix}-${crypto.randomUUID()}`;
    }
    return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
  }

  private _runtimeHeadersToRecord(headers?: HeadersInit) {
    if (!headers) {
      return {};
    }

    if (headers instanceof Headers) {
      return Object.fromEntries(Array.from(headers.entries()));
    }

    if (Array.isArray(headers)) {
      return Object.fromEntries(headers);
    }

    return { ...headers };
  }

  private _runtimeToRequestMessages(): RequestMessage[] {
    return this._runtimeMessages
      .filter((message): message is RuntimeMessage & { role: RequestMessageRole } => {
        return message.role === 'assistant' || message.role === 'user' || message.role === 'system';
      })
      .map(message => ({
        id: message.id || this._createRuntimeId('msg'),
        role: message.role,
        content: message.content,
      }));
  }

  private _runtimeToConversations(): ChatConversation[] {
    return this._runtimeMessages
      .map(message => {
        if (!message?.content) {
          return null;
        }

        if (message.role === 'user') {
          return {
            id: message.id,
            user: 'user',
            text: message.content,
          } as ChatConversation;
        }

        const roleLabel = this._runtimeGetMessageLabel(message.role);
        const text = message.role === 'assistant' ? message.content : `${roleLabel}: ${message.content}`;
        return {
          id: message.id,
          user: 'bot',
          text,
        } as ChatConversation;
      })
      .filter(Boolean) as ChatConversation[];
  }

  private _runtimeSyncConversations() {
    this.chatConversations = this._runtimeToConversations();
    this.scrollContent(0);
  }

  private _normalizeOutgoingBody(body: unknown): string {
    if (typeof body !== 'string' || !body) {
      return body ? String(body) : '';
    }

     try {
      const payload = JSON.parse(body) as JsonObject & {
        version?: string;
        conversationId?: string;
        threadId?: string;
        parentRunId?: string;
        metadata?: JsonObject;
        forwardedProps?: JsonObject;
        messages?: unknown;
        resume?: unknown;
        state?: unknown;
      };
      if (!payload.version) {
        payload.version = DEFAULT_VERSION;
      }
      if (!payload.conversationId && typeof payload.threadId === 'string') {
        payload.conversationId = payload.threadId;
      }
      if (Array.isArray(payload.resume) && !payload.parentRunId && this._lastRunId) {
        payload.parentRunId = this._lastRunId;
      }
      if (!payload.metadata && payload.forwardedProps && typeof payload.forwardedProps === 'object') {
        payload.metadata = payload.forwardedProps;
      }
      payload.messages = this._runtimeToRequestMessages();
      payload.state = {};
      return JSON.stringify(payload);
    } catch {
      return body;
    }

  }

  private _normalizeIncomingEventPayload(payload: JsonObject) {
    if (payload.type !== 'RUN_FINISHED') {
      return payload;
    }

    const outcome = payload.outcome;
    if (!outcome || typeof outcome !== 'object') {
      return payload;
    }

    const normalizedOutcome = { ...(outcome as JsonObject) };
    if (normalizedOutcome.type === 'success' && 'interrupts' in normalizedOutcome) {
      delete normalizedOutcome.interrupts;
      return {
        ...payload,
        outcome: normalizedOutcome,
      };
    }

    return payload;
  }

  private async _normalizeIncomingResponse(response: Response) {
    const contentType = response.headers?.get?.('content-type') || '';
    const responseBody = response.body;

    if (!contentType.includes('text/event-stream') || !responseBody) {
      return response;
    }

    const sourceBody = responseBody as { getReader: () => ReadableStreamDefaultReader<Uint8Array> };
    const textDecoder = new TextDecoder('utf-8');
    const textEncoder = new TextEncoder();

    const encodeEvent = (eventText: string) => {
      const trimmedEventText = eventText.trim();
      if (!trimmedEventText) {
        return null;
      }

      const dataLines = trimmedEventText
        .split(/\r?\n/)
        .filter(line => line.startsWith('data:'));

      if (dataLines.length === 0) {
        return textEncoder.encode(`${eventText}\n\n`);
      }

      const rawPayload = dataLines
        .map(line => line.slice('data:'.length).trimStart())
        .join('\n');

      try {
        const parsedPayload = JSON.parse(rawPayload) as JsonObject;
        const normalizedPayload = this._normalizeIncomingEventPayload(parsedPayload);
        return textEncoder.encode(`data: ${JSON.stringify(normalizedPayload)}\n\n`);
      } catch {
        return textEncoder.encode(`${eventText}\n\n`);
      }
    };

    const normalizedStream = new ReadableStream<Uint8Array>({
      start(controller) {
        const reader = sourceBody.getReader();
        let buffer = '';

        const pushDecodedChunk = async () => {
          const chunk = await reader.read();

          if (chunk.done) {
            const trailingChunk = encodeEvent(buffer);
            if (trailingChunk) {
              controller.enqueue(trailingChunk);
            }
            controller.close();
            reader.releaseLock?.();
            return;
          }

          buffer += textDecoder.decode(chunk.value, { stream: true });
          const events = buffer.split(/\r?\n\r?\n/);
          buffer = events.pop() || '';

          for (const eventText of events) {
            const encodedEvent = encodeEvent(eventText);
            if (encodedEvent) {
              controller.enqueue(encodedEvent);
            }
          }

          await pushDecodedChunk();
        };

        void pushDecodedChunk().catch(error => {
          controller.error(error);
          reader.releaseLock?.();
        });
      },
    });

    return new Response(normalizedStream, {
      status: response.status,
      statusText: response.statusText,
      headers: response.headers,
    });
  }

  private _runtimePushRawEvent(event: JsonObject) {
    this._runtimeRawEvents = [event, ...this._runtimeRawEvents].slice(0, 50);
  }

  private _runtimeResetAgentState() {
    this._runtimeAgent?.abortRun();
    this._queryClient?.abort?.();
    this._runtimeAgent = null;
    this._queryClient = null;
    this._lastRunId = '';
    this.processing = false;
  }

  private _runtimeAppendMessage(message: RuntimeMessage) {
    this._runtimeMessages = [...this._runtimeMessages, message];
    this._runtimeSyncConversations();
  }

  private _extractTextContent(content: unknown): string {
    if (typeof content === 'string') {
      return content;
    }

    if (Array.isArray(content)) {
      return content
        .map(part => {
          if (typeof part === 'string') {
            return part;
          }
          if (!part || typeof part !== 'object') {
            return '';
          }
          if ('text' in part) {
            return String((part as { text?: unknown }).text || '');
          }
          if ('type' in part) {
            return `[${String((part as { type?: unknown }).type || 'content')}]`;
          }
          return '';
        })
        .join('');
    }

    return '';
  }

  private _runtimeSyncMessagesFromSnapshot(messages: ReadonlyArray<Readonly<Message>> = []) {
    this._runtimeMessages = messages
      .map(message => {
        const role = message.role as RuntimeMessageRole;
        let content = '';

        if (role === 'activity') {
          content = JSON.stringify((message as { content?: unknown }).content || {}, null, 2);
        } else {
          content = this._extractTextContent((message as { content?: unknown }).content);
        }

        if (!content && role !== 'assistant') {
          return null;
        }

        return {
          id: message.id || this._createRuntimeId('msg'),
          role,
          content,
        } as RuntimeMessage;
      })
      .filter(Boolean) as RuntimeMessage[];

    this._runtimeSyncConversations();
  }

  private _runtimeAppendAssistantDelta(delta: string, messageId?: string) {
    const lastMessage = this._runtimeMessages[this._runtimeMessages.length - 1];

    if (lastMessage?.role === 'assistant' && (!messageId || lastMessage.id === messageId)) {
      lastMessage.content = `${lastMessage.content}${delta}`;
      this._runtimeMessages = [...this._runtimeMessages.slice(0, -1), lastMessage];
      this._runtimeSyncConversations();
      return;
    }

    this._runtimeMessages = [
      ...this._runtimeMessages,
      {
        id: messageId || this._createRuntimeId('assistant'),
        role: 'assistant',
        content: delta,
      },
    ];
    this._runtimeSyncConversations();
  }

  private _runtimeSetPendingInterrupts(interrupts: Interrupt[] = []) {
    this._runtimePendingInterrupts = interrupts;

    if (interrupts.length === 0) {
      this._runtimePendingInterruptWidget = null;
      this._runtimeInterruptValues = {};
      return;
    }

    const interrupt = interrupts[0];
    const responseSchema = interrupt.responseSchema as InterruptSchema | undefined;
    const properties = responseSchema?.properties || {};
    const fieldNames = Object.keys(properties);

    this._runtimePendingInterruptWidget = {
      interruptId: interrupt.id,
      message: interrupt.message,
      props: {
        label: 'Required Information',
        description: interrupt.message,
        fields: fieldNames.map(fieldName => ({
          fieldName,
          label: fieldName,
          description: properties?.[fieldName]?.description,
        })),
      },
    };

    this._runtimeInterruptValues = fieldNames.reduce((accumulator, fieldName) => {
      accumulator[fieldName] = this._runtimeInterruptValues[fieldName] || '';
      return accumulator;
    }, {} as Record<string, string>);
  }

  private _runtimeBuildInterruptUserMessage() {
    const entries = Object.entries(this._runtimeInterruptValues)
      .filter(entry => String(entry[1]).trim())
      .map(entry => `- ${entry[0]}: ${entry[1]}`);

    if (entries.length === 0) {
      return 'Shared additional details.';
    }

    return `Shared additional details:\n${entries.join('\n')}`;
  }

  private _runtimeBuildResumeEntries(status: 'resolved' | 'cancelled'): ResumeEntry[] {
    return this._runtimePendingInterrupts.map(interrupt => {
      if (status === 'cancelled') {
        return {
          interruptId: interrupt.id,
          status,
        };
      }

      return {
        interruptId: interrupt.id,
        status,
        payload: { ...this._runtimeInterruptValues },
      };
    });
  }

  private _runtimeGetUserLabel() {
    const firstName = this._user?.firstName || '';
    const lastName = this._user?.lastName || '';
    const fullName = `${firstName} ${lastName}`.trim();
    return fullName || this._user?.name || 'You';
  }

  private _runtimeGetMessageLabel(role: RuntimeMessageRole) {
    if (role === 'assistant') {
      return 'Agent';
    }
    if (role === 'tool') {
      return 'Tool';
    }
    if (role === 'activity') {
      return 'Activity';
    }
    if (role === 'reasoning') {
      return 'Reasoning';
    }
    if (role === 'developer') {
      return 'Developer';
    }
    if (role === 'system') {
      return 'System';
    }
    return this._runtimeGetUserLabel();
  }

  private _runtimeOnInterruptFieldInput(fieldName: string, event: CustomEvent<{ value: string }>) {
    this._runtimeInterruptValues = {
      ...this._runtimeInterruptValues,
      [fieldName]: event.detail.value,
    };
  }

  private _runtimeCreateSubscriber(): AgentSubscriber {
    return {
      onEvent: ({ event }) => {
        this._runtimePushRawEvent(event as JsonObject);
      },
      onRunStartedEvent: ({ event }: { event: RunStartedEvent }) => {
        this.conversationId = event.threadId || this.conversationId;
        this._lastRunId = event.runId || this._lastRunId;
        this.uiStatus = 'streaming';
        if (this._runtimeAgent) {
          this._runtimeAgent.threadId = this.conversationId;
        }
        this.requestUpdate();
      },
      onMessagesSnapshotEvent: ({ event }) => {
        this._runtimeSyncMessagesFromSnapshot(event.messages || []);
        this.requestUpdate();
      },
      onStateSnapshotEvent: ({ event }: { event: StateSnapshotEvent }) => {
        this._runtimeLatestSnapshot = (event.snapshot as RunSnapshot) || null;
        const snapshot = this._runtimeLatestSnapshot || {};
        this.conversationId = snapshot.threadId || this.conversationId;
        this._lastRunId = snapshot.runId || this._lastRunId;
        if (Array.isArray(snapshot.pendingInterrupts)) {
          this._runtimeSetPendingInterrupts(snapshot.pendingInterrupts as Interrupt[]);
          if (snapshot.pendingInterrupts.length > 0) {
            this.uiStatus = 'interrupted';
          }
        }
        this.requestUpdate();
      },
      onTextMessageStartEvent: ({ event }: { event: TextMessageStartEvent }) => {
        this._runtimeAppendAssistantDelta('', event.messageId);
        this.requestUpdate();
      },
      onTextMessageContentEvent: ({ event }: { event: TextMessageContentEvent }) => {
        this._runtimeAppendAssistantDelta(event.delta || '', event.messageId);
        this.requestUpdate();
      },
      onTextMessageEndEvent: () => {
        if (this._runtimePendingInterrupts.length === 0) {
          this.uiStatus = 'completed';
        }
        this.requestUpdate();
      },
      onCustomEvent: ({ event }) => {
        if (event.name === 'orchestrator.interrupt.widget') {
          this._runtimePendingInterruptWidget = (event.value as InterruptWidget) || null;
          const fields = this._runtimePendingInterruptWidget?.props?.fields || [];
          this._runtimeInterruptValues = fields.reduce((accumulator, field) => {
            accumulator[field.fieldName] = this._runtimeInterruptValues[field.fieldName] || '';
            return accumulator;
          }, {} as Record<string, string>);
          this.uiStatus = 'interrupted';
          this.requestUpdate();
        }
      },
      onRunFinishedEvent: params => {
        const event = params.event as RunFinishedEvent;
        this.conversationId = event.threadId || this.conversationId;
        this._lastRunId = event.runId || this._lastRunId;

        if (params.outcome === 'interrupt') {
          this._runtimeSetPendingInterrupts(params.interrupts || []);
          this.uiStatus = 'interrupted';
        } else {
          this._runtimeSetPendingInterrupts([]);
          if (this.uiStatus !== 'cancelled') {
            this.uiStatus = 'completed';
          }
        }

        this.requestUpdate();
      },
      onRunErrorEvent: ({ event }: { event: RunErrorEvent }) => {
        this.uiStatus = 'error';
        this._runtimeAppendMessage({
          id: this._createRuntimeId('system'),
          role: 'system',
          content: event.message || 'The AG-UI run failed.',
        });
        this.requestUpdate();
      },
    };
  }

  private getDisplayConversations() {
    if (Array.isArray(this.data) && this.data.length > 0) {
      return this.data.map((conversation, index) => ({
        ...conversation,
        id: conversation.id || `data-${index}`,
      }));
    }

    return [...INITIAL_CONVERSATION];
  }

  private async initializeChat() {
    this._runtimeResetAgentState();
    this._runtimeMessages = [];
    this._runtimeRawEvents = [];
    this._runtimePendingInterrupts = [];
    this._runtimePendingInterruptWidget = null;
    this._runtimeInterruptValues = {};
    this._runtimeLatestSnapshot = null;
    this.chatConversations = [];

    const hasExternalData = Array.isArray(this.data) && this.data.length > 0;
    let aiModelMap: Record<string, any> = {};
    let models: Array<{ id: string; name: string }> = [];
    const { settings } = this;

    if (!this.disableApi && !hasExternalData) {
      const { aiModels, aiModelMap: modelMap } = await this.setupAiModels();
      models = [...aiModels];
      aiModelMap = modelMap;
    }

    if (settings?.sources && settings?.sources.length > 0) {
      const sourceIds = settings.sources.map((source: { id: string }) => source.id?.toUpperCase());
      models = models.filter(model => sourceIds.includes(model.id));
    }

    this.sources = [...models];
    const configuredModel = settings?.model;

    if (configuredModel) {
      this.selectedSource = configuredModel;
    } else if (this.sources.length > 0) {
      this.selectedSource = this.sources[0].id;
    } else {
      this.selectedSource = '';
    }

    this.chatConversations = this.getDisplayConversations();
    this.conversationId = this.createId();
    this.sourceMap = aiModelMap;

    if (settings?.initialInputText) {
      this.inputText = settings.initialInputText;
      this.onSend();
    }
  }

  private getApiProtocol(): ChatProtocol {
    const protocol = this.settings?.apiProtocol;
    if (protocol === 'legacy-graphql') {
      return 'legacy-graphql';
    }
    return DEFAULT_CHAT_PROTOCOL;
  }

  private getChatAdapter(): ChatApiAdapter {
    const protocol = this.getApiProtocol();
    return protocol === 'legacy-graphql' ? legacyGraphqlAdapter : agUiAdapter;
  }

  private getAdapterSettings() {
    return {
      apiProtocol: this.getApiProtocol(),
      agUiEndpoint: this.settings?.agUiEndpoint,
      agUiApiName: this.settings?.agUiApiName,
      agUiResource: this.settings?.agUiResource,
      metadata: this.metadata,
      legacyApiName: this.settings?.legacyApiName,
      legacyResource: this.settings?.legacyResource,
    };
  }

  private getAdapterClients(): AdapterClients {
    return {
      restClient: this._restClient as any,
      graphQLClient: this._graphQLClient as any,
    };
  }

  private async setupAiModels(): Promise<SetupAiModelsResult> {
    let aiModelMap: Record<string, any> = {};
    let aiModels: any[] = [];

    try {
      const adapter = this.getChatAdapter();
      const result = await adapter.setupAiModels(this.getAdapterClients(), this.getAdapterSettings());
      aiModels = result.aiModels || [];
      aiModelMap = result.aiModelMap || {};
    } catch (error) {
      console.warn(`Error loading chat model config for protocol ${this.getApiProtocol()}:`, error);
    }

    return { aiModels, aiModelMap };
  }

  private clearChats() {
    this._runtimeResetAgentState();
    this._runtimeMessages = [];
    this._runtimeRawEvents = [];
    this._runtimePendingInterrupts = [];
    this._runtimePendingInterruptWidget = null;
    this._runtimeInterruptValues = {};
    this._runtimeLatestSnapshot = null;
    this.chatConversations = [];
    this.inputText = '';

    this.cleanPreviousCall();
    this.uiStatus = 'idle';
    this.chatConversations = [...INITIAL_CONVERSATION];
    this.conversationId = this.createId();
    this._lastRunId = '';
  }

  private async cancelCurrentRunOnServer() {
    const cancelApiName = this.settings?.cancelApiName;
    const cancelResource = this.settings?.cancelResource;

    if (!(cancelApiName && cancelResource && this._restClient?.request)) {
      return;
    }

    const payload = {
      protocol: this.getApiProtocol(),
      conversationId: this.conversationId,
      runId: this._lastRunId,
      model: this.selectedSource,
      reason: 'user-cancelled',
      cancelledAt: new Date().toISOString(),
    };

    try {
      await this._restClient.request(
        cancelApiName,
        cancelResource,
        'POST',
        JSON.stringify(payload),
        {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        {}
      );
    } catch (error) {
      console.warn('Error cancelling chat run on server:', error);
    }
  }

  private onSourceChange(event: CustomEvent<{ value: string }>) {
    this.selectedSource = event?.detail?.value || this.selectedSource;
    this.clearChats();
  }

  private onNewChat() {
    this.clearChats();
  }

  private onInput(e: CustomEvent<{ value: string }>) {
    this.inputText = e.detail.value;
  }

  private getRetryActions(): ChatAction[] {
    if (!this._lastSubmittedText) {
      return [];
    }

    return [
      {
        id: `retry-${Date.now()}`,
        title: 'Retry',
        handler: () => this.retryLastMessage(),
      },
    ];
  }

  private retryLastMessage() {
    if (!this._lastSubmittedText || this.processing) {
      return;
    }

    const retryText = this._lastSubmittedText;
    this.emit('sc-action', {
      detail: {
        type: 'retry',
        protocol: this.getApiProtocol(),
        conversationId: this.conversationId,
        model: this.selectedSource,
        content: retryText,
      },
    });

    this.inputText = retryText;
    this.onSend();
  }

  private appendOrReplaceLastBotMessage(text: string, actions: ChatAction[] = []) {
    requestAnimationFrame(() => {
      const botResponse: ChatConversation = {
        user: 'bot',
        text,
        id: this.createId(),
        ...(actions.length > 0 ? { actions } : {}),
      };
      const lastConversation = this.chatConversations[this.chatConversations.length - 1];
      if (lastConversation?.user === 'bot' && lastConversation.id.startsWith('placeholder-')) {
        this.chatConversations = this.chatConversations.slice(0, -1).concat(botResponse);
      } else {
        this.chatConversations = [...this.chatConversations, botResponse];
      }
      this.scrollContent(0);
    });
  }

  private cleanPreviousCall() {
    this.finishWaiting();
    if (this._queryClient?.abort) {
      try {
        this._queryClient.abort();
      } catch (error) {
        console.warn(error);
      }
    }
  }

  private finishWaiting() {
    this.processing = false;
    this.inputText = '';
    if (this._queryTimer) {
      clearTimeout(this._queryTimer);
      this._queryTimer = null;
    }
  }

  private waiting() {
    this.processing = true;
    requestAnimationFrame(() => {
      const botResponse: ChatConversation = {
        user: 'bot',
        text: 'Please hold. I\'m thinking...',
        id: `placeholder-${this.createId()}`,
      };
      this.chatConversations = [...this.chatConversations, botResponse];
      this.scrollContent(0);
    });
  }

  private waitingLonger() {
    requestAnimationFrame(() => {
      const botResponse: ChatConversation = {
        user: 'bot',
        text: 'This one\'s taking a little longer. Hang tight...',
        id: `placeholder-${this.createId()}`,
      };
      const lastConversation = this.chatConversations[this.chatConversations.length - 1];
      if (lastConversation?.user === 'bot' && lastConversation.id.startsWith('placeholder-')) {
        this.chatConversations = this.chatConversations.slice(0, -1).concat(botResponse);
        this.scrollContent(0);
      }
    });
  }

  private stopWaiting() {
    requestAnimationFrame(() => {
      const botResponse: ChatConversation = {
        user: 'bot',
        text: 'Hm... looks like I got stuck. Try asking again.',
        id: this.createId(),
        actions: this.getRetryActions(),
      };
      const lastConversation = this.chatConversations[this.chatConversations.length - 1];
      if (lastConversation?.user === 'bot' && lastConversation.id.startsWith('placeholder-')) {
        this.chatConversations = this.chatConversations.slice(0, -1).concat(botResponse);
        this.scrollContent(0);
      }
    });
    const durationMs = this._runStartAt ? Date.now() - this._runStartAt : undefined;
    this._runStartAt = null;
    this.uiStatus = 'error';
    this.emit('sc-submit-error', {
      detail: {
        protocol: this.getApiProtocol(),
        conversationId: this.conversationId,
        model: this.selectedSource,
        message: 'Request timeout',
        durationMs,
      },
    });
    this.cleanPreviousCall();
  }

  private toAgUiMessage(conversation: ChatConversation): Message | null {
    if (conversation.user === 'user') {
      return {
        id: conversation.id || this.createId(),
        role: 'user',
        content: conversation.text,
      } as Message;
    }

    if (conversation.user === 'bot') {
      return {
        id: conversation.id || this.createId(),
        role: 'assistant',
        content: conversation.text,
      } as Message;
    }

    return null;
  }

  private buildRunAgentInput(messages: Message[]) {
    const selectedModel = this.selectedSource || this.settings?.model || '';
    const runId = `${this.conversationId}-${Date.now()}`;
    this._lastRunId = runId;

    return {
      threadId: this.conversationId,
      runId,
      messages,
      tools: [],
      context: [],
      state: {},
      forwardedProps: {
        ...(this.metadata || {}),
        model: selectedModel,
        source: selectedModel,
      },
    };
  }

  private handleStreamData(delta: string) {
    if (!delta) {
      return;
    }

    const lastConversation = this.chatConversations[this.chatConversations.length - 1];
    if (lastConversation?.user === 'bot' && lastConversation.id.startsWith('placeholder-')) {
      this.chatConversations = [
        ...this.chatConversations.slice(0, -1),
        {
          ...lastConversation,
          text: `${lastConversation.text}${delta}`,
        },
      ];
    } else {
      this.chatConversations = [
        ...this.chatConversations,
        {
          user: 'bot',
          text: delta,
          id: `placeholder-${this.createId()}`,
        },
      ];
    }

    this.scrollContent(0);
    this.emit('sc-change', {
      detail: {
        type: 'assistant-delta',
        protocol: this.getApiProtocol(),
        conversationId: this.conversationId,
        model: this.selectedSource,
        delta,
      },
    });
  }

  private handleCompletedData() {
    this.uiStatus = 'success';
    this.finishWaiting();
    this.emit('sc-submit-success', {
      detail: {
        protocol: this.getApiProtocol(),
        conversationId: this.conversationId,
        model: this.selectedSource,
        runId: this._lastRunId,
      },
    });
  }

  private handleStreamError(error: any) {
    this.uiStatus = 'error';
    this.finishWaiting();

    this.emit('sc-submit-error', {
      detail: {
        protocol: this.getApiProtocol(),
        conversationId: this.conversationId,
        model: this.selectedSource,
        error,
      },
    });
  }

  private handleRuntimeInterruptFromStream(interrupts: Interrupt[] = []) {
    this._runtimeSetPendingInterrupts(interrupts);
    this.uiStatus = 'interrupted';
    this.finishWaiting();
  }

  private handleRuntimeInterruptWidgetFromStream(widget: InterruptWidget | null) {
    if (!widget) {
      return;
    }

    this._runtimePendingInterruptWidget = widget;
    const fields = this._runtimePendingInterruptWidget?.props?.fields || [];
    this._runtimeInterruptValues = fields.reduce((accumulator, field) => {
      accumulator[field.fieldName] = this._runtimeInterruptValues[field.fieldName] || '';
      return accumulator;
    }, {} as Record<string, string>);

    this.uiStatus = 'interrupted';
    this.finishWaiting();
  }

  private async processInput(
    inputText: string,
    callbacks: {
      onData: (data: string) => void;
      onComplete?: () => void;
      onError?: (error: any) => void;
      onRunStarted?: (meta: { conversationId?: string; runId?: string }) => void;
      onInterrupt?: (interrupts: Interrupt[]) => void;
      onInterruptWidget?: (widget: InterruptWidget | null) => void;
    }
  ) {
    const adapter = this.getChatAdapter();
    await adapter.streamChat(
      this.getAdapterClients(),
      {
        content: inputText,
        model: this.selectedSource || this.settings?.model || '',
        conversationId: this.conversationId,
        toolsetId: this.metadata?.toolsetId,
        categoryId: this.metadata?.categoryId,
      },
      {
        onData: callbacks.onData,
        onComplete: callbacks.onComplete,
        onError: callbacks.onError,
        onRunStarted: callbacks.onRunStarted,
        onInterrupt: callbacks.onInterrupt,
        onInterruptWidget: callbacks.onInterruptWidget,
        onSend: client => {
          this._queryClient = client;
        },
      },
      this.getAdapterSettings()
    );
  }

  private onCancel() {
    if (!this.processing) {
      return;
    }
    this._runtimeCancelActiveRun();
    this.appendOrReplaceLastBotMessage('Generation cancelled by user.', this.getRetryActions());
    this.emit('sc-cancel', {
      detail: {
        protocol: this.getApiProtocol(),
        conversationId: this.conversationId,
        model: this.selectedSource,
      },
    });
    void this.cancelCurrentRunOnServer();
    this.cleanPreviousCall();
  }

  private onSend() {
    const inputText = this.inputText?.trim();
    if (!inputText) {
      return;
    }

    this._lastSubmittedText = inputText;

    this.inputText = '';

    this.uiStatus = 'streaming';

    const newChat: ChatConversation = { user: 'user', text: inputText, id: this.createId() };
    this.chatConversations = [...this.chatConversations, newChat];
    this.scrollContent(0);

    this.emit('sc-action', {
      detail: {
        type: 'message-send',
        protocol: this.getApiProtocol(),
        conversationId: this.conversationId,
        model: this.selectedSource,
        content: inputText,
      },
    });

    const agUiMessages = this.chatConversations
      .map(conversation => this.toAgUiMessage(conversation))
      .filter((message): message is Message => !!message);
    const runAgentInput = this.buildRunAgentInput(agUiMessages);

    this.emit('sc-post', {
      detail: {
        protocol: this.getApiProtocol(),
        runAgentInput,
      },
    });

    if (this.disableApi) {
      this.uiStatus = 'success';
      this.finishWaiting();
      return;
    }

    this.waiting();
    this._runStartAt = Date.now();
    this.emit('sc-action', {
      detail: {
        type: 'run-start',
        protocol: this.getApiProtocol(),
        conversationId: this.conversationId,
        model: this.selectedSource,
      },
    });

    void this.processInput(inputText, {
      onData: this.handleStreamData.bind(this),
      onComplete: this.handleCompletedData.bind(this),
      onRunStarted: meta => {
        this.conversationId = meta.conversationId || this.conversationId;
        this._lastRunId = meta.runId || this._lastRunId;
      },
      onInterrupt: interrupts => this.handleRuntimeInterruptFromStream(interrupts),
      onInterruptWidget: widget => this.handleRuntimeInterruptWidgetFromStream(widget),
      onError: (error: any) => this.handleStreamError(error),
    });

    this._queryTimer = setTimeout(() => {
      this.waitingLonger();
      if (this._queryTimer) {
        clearTimeout(this._queryTimer);
      }
      this._queryTimer = setTimeout(() => {
        this.stopWaiting();
      }, WAITING_THRESHOLD_TIME - WAITING_TIME);
    }, WAITING_TIME);

  }

  private scrollContent(delay = 1000) {
    setTimeout(() => {
      const scrollEl = this.shadowRoot?.querySelector('.chat-content') as HTMLElement | null;
      scrollEl?.scrollTo?.({
        top: scrollEl.scrollHeight,
        behavior: 'smooth',
      });
    }, delay);
  }

  private getSize() {
    return this.settings?.size || 'xl';
  }

  private getChatAvatar() {
    const source = this.selectedSource?.toUpperCase();
    return avatarMapping[source] || chatAvatar;
  }

  private _runtimeGetAgent() {
    if (this._runtimeAgent) {
      return this._runtimeAgent;
    }

    this._runtimeAgent = createAgUiRuntimeAgent({
      restClient: this._restClient,
      agUiApiName: this.settings?.agUiApiName,
      agUiResource: this.settings?.agUiResource,
      conversationId: this.conversationId,
      normalizeOutgoingBody: body => this._normalizeOutgoingBody(body),
      runtimeHeadersToRecord: headers => this._runtimeHeadersToRecord(headers),
      normalizeIncomingResponse: response => this._normalizeIncomingResponse(response),
      onSend: client => {
        this._queryClient = client;
      },
    });

    return this._runtimeAgent;
  }

  private _runtimeRenderInterruptPanel() {
    if (!this._runtimePendingInterruptWidget) {
      return nothing;
    }

    const fields = this._runtimePendingInterruptWidget?.props?.fields || [];

    return html`
      <div class="runtime-interrupt-panel">
        <sc-title level="4">Please share a few more details to continue</sc-title>
        <div class="runtime-interrupt-fields">
          ${fields.map(
            field => html`
              <sc-text-input
                .value=${this._runtimeInterruptValues[field.fieldName] || ''}
                placeholder=${field.label || field.fieldName}
                @sc-input=${(event: CustomEvent<{ value: string }>) =>
                  this._runtimeOnInterruptFieldInput(field.fieldName, event)}
              ></sc-text-input>
            `
          )}
        </div>
        <div class="runtime-interrupt-actions">
          <sc-button
            type="primary"
            ?disabled=${this.processing}
            @click=${() => this._runtimeSubmitInterruptResponse('resolved')}
          >
            Continue
          </sc-button>
          <sc-button
            type="secondary"
            ?disabled=${this.processing}
            @click=${() => this._runtimeSubmitInterruptResponse('cancelled')}
          >
            Cancel request
          </sc-button>
        </div>
      </div>
    `;
  }

  private _runtimeRenderSnapshotPanel() {
    return html`
      <div class="accordion-shell">
        <sc-accordion summary-line="0" icon-position="right">
          <div slot="summary" class="accordion-summary">Latest State Snapshot</div>
          <div class="accordion-content snapshot-box">
            <pre class="snapshot-pre">${JSON.stringify(this._runtimeLatestSnapshot, null, 2)}</pre>
          </div>
        </sc-accordion>
      </div>
    `;
  }

  private _runtimeRenderEventsPanel() {
    return html`
      <div class="accordion-shell">
        <sc-accordion summary-line="0" icon-position="right">
          <div slot="summary" class="accordion-summary">Activity log</div>
          <div class="accordion-content events-box">
            ${this._runtimeRawEvents.length === 0
              ? html`<sc-paragraph>No events received yet.</sc-paragraph>`
              : this._runtimeRawEvents.map(
                  event => html`
                    <div class="event-item">
                      <sc-paragraph>${event.type || 'UNKNOWN_EVENT'}</sc-paragraph>
                      <pre class="event-pre">${JSON.stringify(event, null, 2)}</pre>
                    </div>
                  `
                )}
          </div>
        </sc-accordion>
      </div>
    `;
  }

  private _runtimeCancelActiveRun() {
    if (!this.processing) {
      return;
    }

    this._runtimeAgent?.abortRun();
    this._queryClient?.abort?.();
    this.processing = false;
    this.uiStatus = 'cancelled';
  }

  private async _runtimeSubmitInterruptResponse(status: 'resolved' | 'cancelled') {
    if (this._runtimePendingInterrupts.length === 0 || this.processing) {
      return;
    }

    const agent = this._runtimeGetAgent();
    const resume = this._runtimeBuildResumeEntries(status);
    const summary = status === 'resolved' ? this._runtimeBuildInterruptUserMessage() : '';
    const model = this.selectedSource || this.settings?.model || '';
    const runtimeMetadata = {
      ...(this.metadata || {}),
      model,
    };

    this.processing = true;
    this.uiStatus = 'resuming';

    try {
      await executeAgUiRuntimeRun({
        mode: 'resume',
        agent,
        status,
        resume,
        createRuntimeId: prefix => this._createRuntimeId(prefix),
        metadata: runtimeMetadata,
        subscriber: this._runtimeCreateSubscriber(),
        summary,
        onUserMessage: message => {
          this._runtimeAppendMessage({ id: message.id, role: 'user', content: summary });
        },
      });

      if (status === 'cancelled') {
        this._runtimeSetPendingInterrupts([]);
        this.uiStatus = 'cancelled';
        this._runtimeAppendMessage({
          id: this._createRuntimeId('system'),
          role: 'system',
          content: 'This request was cancelled. You can continue the conversation below whenever you are ready.',
        });
      }
    } catch (error) {
      this.uiStatus = 'error';
      this._runtimeAppendMessage({
        id: this._createRuntimeId('system'),
        role: 'system',
        content: `Resume failed: ${String(error)}`,
      });
    } finally {
      this.processing = false;
      this.requestUpdate();
    }
  }

  private renderChatSources() {

    if (this.sources.length === 0) {
      return null;
    }

    const sourceSelections = this.sources.map(source => {
      return {
        label: source.name,
        value: source.id,
      };
    });

    return html`
      <sc-dropdown-input
        class="sources"
        hoist
        value=${this.selectedSource}
        .data=${sourceSelections}
        @sc-select=${this.onSourceChange}
      ></sc-dropdown-input>
    `;
  }

  private getHeaderActions(): ChatHeaderActionConfig[] {
    return Array.isArray(this.settings?.headerActions) ? this.settings.headerActions : [];
  }

  private onHeaderActionClick(action: ChatHeaderActionConfig) {
    if (action.disabled) {
      return;
    }

    if (typeof action.handler === 'function') {
      action.handler({
        action,
        component: this,
      });
      return;
    }

    const { handler, ...actionDetail } = action;

    this.emit('sc-action', {
      detail: {
        type: 'header-action',
        eventName: action.eventName || 'sc-header-action',
        protocol: this.getApiProtocol(),
        conversationId: this.conversationId,
        model: this.selectedSource,
        action: actionDetail,
      },
    });
  }

  private renderHeaderAction(action: ChatHeaderActionConfig, index: number) {
    const actionKey = action.id || action.label || action.icon || `header-action-${index}`;
    const title = action.title || action.label || action.id || 'Header action';
    const icon = action.icon || 'link';
    const isIconOnly = !action.label;

    if (isIconOnly) {
      return html`
        <sc-icon
          class="chat-header-action-icon"
          name=${icon}
          size=${action.iconSize || 'sm'}
          title=${title}
          aria-disabled=${action.disabled ? 'true' : 'false'}
          @click=${() => this.onHeaderActionClick(action)}
          data-action-key=${actionKey}
        ></sc-icon>
      `;
    }

    return html`
      <sc-button
        size="sm"
        .type=${action.buttonType || 'secondary'}
        left-icon=${action.leftIcon || action.icon || ''}
        right-icon=${action.rightIcon || ''}
        ?disabled=${action.disabled}
        @click=${() => this.onHeaderActionClick(action)}
      >
        ${action.label}
      </sc-button>
    `;
  }

  render() {
    const size = this.getSize();
    const headerActions = this.getHeaderActions();
    const disableRuntimeFooterInput = this._runtimePendingInterrupts.length > 0;
    const chatInputPlaceholder = this.settings?.inputPlaceholder || 'Enter text here...';
    const chatLayoutStyle = `--sc-layout-right-offset: ${this.showLog ? '1rem' : '0'};`;

    return html`
      <div class="chat-layout-outer">
        <sc-column-layout
          class="chat-layout"
          style=${chatLayoutStyle}
          layout=${this.showLog ? 'Main Content Left' : 'Main Content Full'}
          height="auto"
          ?right-column-collapsible=${this.showLog}
          right-column-collapse
        >
          <div slot=${this.showLog ? 'left' : 'content'} class="chat-layout-middle">
            <div class=${`chat-widget chat-widget-${size}`}>
              <div class="chat-header">
                ${this.renderChatSources()}
                <div class="chat-header-actions">
                  <sc-button size="sm" type="secondary" left-icon="plus" @click=${this.onNewChat}>
                    Start new chat
                  </sc-button>
                  ${headerActions.map((action, index) => this.renderHeaderAction(action, index))}
                </div>
              </div>
              <sc-scrollbar class="chat-content-scrollbar" block>
                <div class="chat-content">
                  <sc-chat-box
                    .size=${size}
                    .conversations=${this.chatConversations}
                    .botAvatarImage=${this.settings?.botAvatarImage || this.getChatAvatar()}
                    .userAvatarImage=${this.settings?.userAvatarImage}
                  ></sc-chat-box>
                  ${this._runtimeRenderInterruptPanel()}
                </div>
              </sc-scrollbar>
              <div class="chat-footer">
                <sc-chat-input
                  ?processing=${this.processing}
                  ?disabled=${disableRuntimeFooterInput}
                  rows=${size !== 'sm' ? 5 : 2}
                  .placeholder=${chatInputPlaceholder}
                  .defaultValue=${this.inputText}
                  @sc-input=${this.onInput}
                  @send=${this.onSend}
                  @cancel=${this.onCancel}
                ></sc-chat-input>
              </div>
            </div>
          </div>
          ${this.showLog
            ? html`
                <div slot="right" class="runtime-debug-float">
                  <div class="runtime-debug-panels-shell">
                    <div class="runtime-debug-panels">
                      <div class="runtime-debug-panels-inner">
                        ${this._runtimeRenderSnapshotPanel()} ${this._runtimeRenderEventsPanel()}
                      </div>
                    </div>
                  </div>
                </div>
              `
            : nothing}
        </sc-column-layout>
      </div>
    `;
  }
}
