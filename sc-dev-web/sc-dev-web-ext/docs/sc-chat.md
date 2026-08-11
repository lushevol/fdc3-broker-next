# ScChat Usage Guide

## 1. Overview

`sc-chat` is a multi-protocol chat component that supports the following modes:

- AG-UI streaming chat (`apiProtocol: 'ag-ui'`)
- Legacy GraphQL streaming chat (`apiProtocol: 'legacy-graphql'`)
- Frontend-managed mode (`disable-api` + `data` + `sc-post` listener)
- Custom header actions (`settings.headerActions`)

Source files:

- `src/components/ScChat/ScChat.ts`
- `src/components/ScChat/ScChatBox.ts`
- `src/components/ScChat/ScChatInput.ts`

---

## 2. Quick Start

### 2.1 Import

```html
<script type="module">
  import '@scdevkit/webkit-ext/elements';
</script>
```

### 2.2 Minimal Example

```html
<sc-chat></sc-chat>
```

For local testing in this repository, see:

- `demo/chat.html`

---

## 3. Public Properties

### 3.1 Top-level Properties

| Property | Type | Default | Description |
| --- | --- | --- | --- |
| `settings` | `Record<string, any>` | `{}` | Chat configuration object |
| `data` | `ChatConversation[]` | `[]` | Externally controlled conversation list |
| `metadata` | `Record<string, any>` | `{}` | Custom metadata passed to AG-UI request body |
| `disable-api` | `boolean` | `false` | When `true`, no backend request is made; only events are emitted |

### 3.2 settings Fields

| Field | Type | Default | Description |
| --- | --- | --- | --- |
| `size` | `'sm' \| 'md' \| 'xl'` | `'xl'` | Component size |
| `apiProtocol` | `'ag-ui' \| 'legacy-graphql'` | `'ag-ui'` | Protocol selection |
| `model` | `string` | First source ID or empty string | Selected model ID |
| `sources` | `Array<{ id: string }>` | `undefined` | Filters source list by IDs |
| `headerActions` | `ChatHeaderActionConfig[]` | `[]` | Custom actions in chat header. The built-in `Start new chat` button stays at the left side of the action group. |
| `initialInputText` | `string` | `undefined` | Sends the initial message automatically |
| `botAvatarImage` | `string` | Internal source mapping | Bot avatar image |
| `userAvatarImage` | `string` | Internal default avatar | User avatar image |
| `inputPlaceholder` | `string` | `Ask your backend agent a question` | Placeholder text for the chat input |
| `agUiEndpoint` | `string` | `undefined` | Deprecated; no longer used |
| `agUiApiName` | `string` | `'ag-ui-api'` | AG-UI restClient apiName |
| `agUiResource` | `string` | `'chat'` | AG-UI restClient resource |
| `legacyApiName` | `string` | `'55313-195-ask-sb-plugin-ask-sb-plugin-exp-api'` | Legacy restClient apiName |
| `legacyResource` | `string` | `'sse'` | Legacy restClient resource |
| `cancelApiName` | `string` | `undefined` | Optional restClient apiName for cancel request |
| `cancelResource` | `string` | `undefined` | Optional restClient resource for cancel request |
| `cancelEndpoint` | `string` | `undefined` | Deprecated; no longer used |

Notes:

- AG-UI requests are sent through `restClient.request(agUiApiName, agUiResource, ...)`.
- Legacy GraphQL requests are sent through `restClient.request(legacyApiName, legacyResource, ...)`.
- When user cancels generation, if `cancelApiName + cancelResource` is configured, `sc-chat` sends a `POST` cancel payload: `{ protocol, conversationId, runId, model, reason, cancelledAt }`.
- For AG-UI, custom request metadata should be passed via the top-level `metadata` component property.

### 3.3 Header Action Schema

```ts
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
}
```

Behavior:

- If `label` is provided, the action renders as `sc-button`.
- If `label` is empty, the action renders as icon-only (`sc-icon`).
- If `handler` exists, it is called directly on click.
- If `handler` is not provided, component emits `sc-action` with `detail.type = 'header-action'`.

---

## 4. Data Model

### 4.1 ChatConversation

```ts
interface ChatAction {
  id: string;
  title: string;
  handler: () => void;
}

interface ChatConversation {
  user: string; // Common values: 'user' | 'bot'
  text: string;
  id: string;
  actions?: ChatAction[];
}
```

When `data` is provided and `data.length > 0`, the component renders external conversations first.

---

## 5. Events

### 5.1 sc-post

After the user sends a message, the component emits `sc-post` (regardless of `disable-api` value).

Event detail payload:

```ts
{
  protocol: 'ag-ui' | 'legacy-graphql',
  runAgentInput: {
    threadId: string,
    runId: string,
    messages: Message[],
    tools: [],
    context: [],
    state: {},
    forwardedProps: {
      model: string,
      source: string,
    }
  }
}
```

Typical use cases:

- Tracking and analytics
- Frontend-managed reply flow (`disable-api=true`)
- Forwarding to a custom agent or gateway

### 5.2 sc-action (Header Action Subtype)

When a custom header action is clicked and no local `handler` is provided, the component emits `sc-action` with the following detail:

```ts
{
  type: 'header-action',
  eventName: string, // defaults to 'sc-header-action'
  protocol: 'ag-ui' | 'legacy-graphql',
  conversationId: string,
  model: string,
  action: {
    id?: string,
    label?: string,
    icon?: string,
    iconSize?: 'xs' | 'sm' | 'md' | 'lg',
    title?: string,
    disabled?: boolean,
    buttonType?: 'primary' | 'secondary' | 'tertiary',
    leftIcon?: string,
    rightIcon?: string,
    eventName?: string,
    eventDetail?: Record<string, any>
  }
}
```

### 5.3 sc-cancel

When the user clicks the cancel button while generation is in progress, the component emits `sc-cancel`.

Event detail payload:

```ts
{
  protocol: 'ag-ui' | 'legacy-graphql',
  conversationId: string,
  model: string,
}
```

---

## 6. Usage Examples

### 6.1 AG-UI Mode

```html
<script type="module">
  import { html, render } from 'lit';
  import '@scdevkit/webkit-ext/elements';

  const settings = {
    size: 'xl',
    model: 'SB_SUPPORT',
    apiProtocol: 'ag-ui',
  };

  const metadata = {
    userId: 'demo-user',
    channel: 'chat-demo',
  };

  render(html`<sc-chat .settings=${settings} .metadata=${metadata}></sc-chat>`, document.body);
</script>
```

### 6.2 Legacy GraphQL Mode

```html
<script type="module">
  import { html, render } from 'lit';
  import '@scdevkit/webkit-ext/elements';

  const settings = {
    size: 'xl',
    model: 'SB_SUPPORT',
    apiProtocol: 'legacy-graphql',
    legacyResource: 'sse',
  };

  render(html`<sc-chat .settings=${settings}></sc-chat>`, document.body);
</script>
```

### 6.3 disable-api + data (Frontend-managed)

```html
<script type="module">
  import { html, render } from 'lit';
  import '@scdevkit/webkit-ext/elements';

  const localData = [
    { user: 'bot', text: 'This is local mode.', id: 'local-1' },
  ];

  const handlePost = event => {
    const chatEl = event.currentTarget;
    const messages = event.detail?.runAgentInput?.messages || [];
    const latest = [...messages].reverse().find(item => item?.role === 'user');
    if (!latest || typeof latest.content !== 'string') return;

    chatEl.data = [
      ...messages
        .map(item => {
          if (item?.role === 'assistant') return { user: 'bot', text: item.content, id: item.id };
          if (item?.role === 'user') return { user: 'user', text: item.content, id: item.id };
          return null;
        })
        .filter(Boolean),
      {
        user: 'bot',
        text: `Mock reply: ${latest.content}`,
        id: `mock-${Date.now()}`,
      },
    ];
  };

  render(
    html`
      <sc-chat
        .data=${localData}
        ?disable-api=${true}
        @sc-post=${handlePost}
      ></sc-chat>
    `,
    document.body
  );
</script>
```

### 6.4 Custom Header Actions

```html
<script type="module">
  import { html, render } from 'lit';
  import '@scdevkit/webkit-ext/elements';

  const settings = {
    size: 'xl',
    model: 'SB_SUPPORT',
    apiProtocol: 'ag-ui',
    headerActions: [
      {
        id: 'history',
        icon: 'history',
        title: 'Open history',
        eventDetail: { target: 'history' },
      },
      {
        id: 'copy-link',
        label: 'Copy link',
        icon: 'link',
        handler: () => {
          const shareLink = `${window.location.origin}/demo/chat.html`;
          navigator?.clipboard?.writeText?.(shareLink);
        },
      },
      {
        id: 'faq',
        label: 'FAQ',
        leftIcon: 'question-circle',
        eventDetail: { target: 'faq' },
      },
    ],
  };

  const onAction = event => {
    if (event.detail?.type !== 'header-action') {
      return;
    }
    console.log('Header action event:', event.detail);
  };

  render(
    html`<sc-chat .settings=${settings} @sc-action=${onAction}></sc-chat>`,
    document.body
  );
</script>
```

---

## 7. FAQ

### 7.1 Why do I still receive `sc-post` when `disable-api=true`?

This is expected by design. `sc-post` is a send-action event so the host app can take control.

### 7.2 How can I display fixed conversations without backend calls?

- Pass `data`
- Set `disable-api=true`
- Optionally listen to `sc-post` and update `data` yourself

### 7.3 What if avatar assets fail to load in another host project?

This component uses internal asset path mapping. Make sure your build output includes `dist/src/assets/*`. If your host bundler has custom static asset requirements, configure matching asset handling rules there.

---