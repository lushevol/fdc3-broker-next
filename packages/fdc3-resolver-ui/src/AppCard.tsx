/**
 * App Card Component
 *
 * Displays a single application target within the FDC3 intent resolver dialog.
 * Each card represents an available application that can handle the intent,
 * showing the app's icon, name, description, instance information, and current context.
 *
 * ## Features
 *
 * - **Visual States**: Selected, focused, and hover states for clear feedback
 * - **App Icons**: Displays the first icon from the app's metadata (48x48px)
 * - **Instance Info**: Shows instance ID when targeting specific instances
 * - **Context Display**: Shows current context when the app is running
 * - **Accessibility**: Fully accessible with keyboard navigation and ARIA attributes
 * - **Auto-focus**: Automatically receives focus when the `focused` prop is `true`
 *
 * ## Accessibility
 *
 * The AppCard component implements WCAG 2.1 AA accessibility requirements:
 *
 * - **Role**: `role="option"` (part of a listbox in the parent dialog)
 * - **Selection State**: `aria-selected` reflects the `selected` prop
 * - **Keyboard Interaction**:
 *   - `Enter` or `Space` - Activates the card (calls `onClick`)
 *   - `Tab` - Focuses the card when `tabIndex={0}`
 * - **Visual Focus**: Clear focus ring when focused
 * - **Color Contrast**: Meets AA standards for text and borders
 *
 * ## Visual States
 *
 * The card has three visual states:
 *
 * 1. **Default**: Gray border (`#e0e0e0`), white background
 * 2. **Selected**: Blue border (`#1976d2`), light blue background (`#e3f2fd`)
 * 3. **Focused**: Light blue border (`#42a5f5`), white background
 *
 * Transitions between states use a smooth 0.2s animation.
 *
 * ## Usage in Resolver Dialog
 *
 * This component is typically used within {@link ResolverDialog} to display
 * available target applications:
 *
 * ```typescript
 * {targets.map((target, index) => (
 *   <AppCard
 *     key={target.instanceId || target.appId}
 *     app={target.metadata}
 *     instanceId={target.instanceId}
 *     currentContext={target.currentContext}
 *     selected={selectedTarget?.appId === target.appId}
 *     focused={focusedIndex === index}
 *     onClick={() => handleSelect(target)}
 *     onDoubleClick={() => handleLaunch(target)}
 *     tabIndex={focusedIndex === index ? 0 : -1}
 *   />
 * ))}
 * ```
 *
 * ## Layout and Content
 *
 * The card displays the following information (when available):
 *
 * 1. **App Icon** (48x48px) - First icon from `app.icons` array
 * 2. **App Name** (16px, bold) - `app.title` or `app.name`
 * 3. **Instance ID** (12px, gray) - When `instanceId` is provided
 * 4. **Current Context** (12px, monospace) - When `currentContext` is provided
 * 5. **Description** (12px, gray) - When `app.description` is available
 *
 * @example
 * ```typescript
 * function MyAppCard() {
 *   const [selected, setSelected] = useState(false);
 *   const [focused, setFocused] = useState(false);
 *
 *   const app: AppMetadata = {
 *     appId: 'my-chart-app',
 *     name: 'Chart App',
 *     title: 'Advanced Charting',
 *     description: 'Display financial charts and analysis',
 *     icons: [{ src: '/icons/chart.png', size: 'md', type: 'image/png' }]
 *   };
 *
 *   const context: Context = {
 *     type: 'fdc3.instrument',
 *     name: 'Apple Inc.',
 *     id: { ticker: 'AAPL' }
 *   };
 *
 *   return (
 *     <AppCard
 *       app={app}
 *       instanceId="chart-app-001"
 *       currentContext={context}
 *       selected={selected}
 *       focused={focused}
 *       onClick={() => setSelected(!selected)}
 *       onDoubleClick={() => console.log('Launch app')}
 *       tabIndex={focused ? 0 : -1}
 *     />
 *   );
 * }
 * ```
 *
 * ## Styling and Customization
 *
 * The card uses inline styles with the following design tokens:
 *
 * - **Border**: 2px solid, color varies by state
 * - **Border Radius**: 8px
 * - **Padding**: 16px
 * - **Margin**: 8px
 * - **Cursor**: Pointer to indicate interactivity
 * - **Transition**: All 0.2s ease for smooth state changes
 *
 * CSS classes are also applied for additional styling:
 * - `.fdc3-resolver-app-card` - Base class
 * - `.fdc3-resolver-app-card.selected` - When selected
 * - `.fdc3-resolver-app-card.focused` - When focused
 *
 * @see {@link ResolverDialog} - Parent dialog component
 * @see {@link AppCardProps} - Component props interface
 * @see {@link useResolverKeyboard} - Hook for managing focus state
 */

import React from 'react';
import { Card, Colors, Typography, AppCardStyles } from './styles';
import type { AppCardProps } from './types';

/**
 * App Card Component
 *
 * @param props - The app card props
 * @returns A clickable card displaying app information
 */
export const AppCard: React.FC<AppCardProps> = ({
  app,
  instanceId,
  currentContext,
  selected,
  focused,
  onClick,
  onDoubleClick,
  tabIndex,
}) => {
  const cardRef = React.useRef<HTMLDivElement>(null);

  // Auto-focus if this card is focused
  React.useEffect(() => {
    if (focused && cardRef.current) {
      cardRef.current.focus();
    }
  }, [focused]);

  const handleClick = () => {
    onClick();
  };

  const handleDoubleClick = () => {
    onDoubleClick();
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleClick();
    }
  };

  return (
    <div
      ref={cardRef}
      className={`fdc3-resolver-app-card ${selected ? 'selected' : ''} ${focused ? 'focused' : ''}`}
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
      onKeyDown={handleKeyDown}
      tabIndex={tabIndex}
      role="option"
      aria-selected={selected}
      style={{
        ...Card.base,
        border: '2px solid',
        borderColor: selected ? Colors.primary : focused ? Colors.primaryLight : Colors.border,
        margin: '8px',
        backgroundColor: selected ? '#e3f2fd' : Colors.background,
      }}
    >
      {/* App Icon */}
      {app.icons && app.icons.length > 0 && (
        <img
          src={app.icons[0].src}
          alt={app.name}
          style={{
            width: '48px',
            height: '48px',
            borderRadius: '8px',
            marginBottom: '8px',
          }}
        />
      )}

      {/* App Name */}
      <div style={AppCardStyles.name}>{app.title || app.name}</div>

      {/* App Instance */}
      <div style={{ ...Typography.caption, marginBottom: '8px' }}>
        {instanceId ? `Instance: ${instanceId}` : 'New instance'}
      </div>

      {/* Current Context */}
      {currentContext && (
        <div
          style={{
            ...Typography.caption,
            padding: '8px',
            backgroundColor: Colors.backgroundLight,
            borderRadius: '4px',
          }}
        >
          <div>Current Context:</div>
          <div style={{ fontFamily: 'monospace', marginTop: '4px' }}>{currentContext.type}</div>
        </div>
      )}

      {/* App Description */}
      {app.description && (
        <div style={{ ...Typography.caption, marginTop: '8px' }}>{app.description}</div>
      )}
    </div>
  );
};

export default AppCard;
