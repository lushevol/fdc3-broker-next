/**
 * Resolver Dialog Component
 *
 * A modal dialog component for FDC3 intent resolution. When multiple applications
 * can handle an intent with a given context, this dialog presents the available
 * targets to the user for selection.
 *
 * ## Features
 *
 * - **Modal Overlay**: Displays as a centered modal with backdrop overlay
 * - **Context Preview**: Shows the FDC3 context data in formatted JSON for verification
 * - **Keyboard Navigation**: Full keyboard support (Arrow keys, Enter, Escape, Home, End)
 * - **Accessibility**: WCAG 2.1 AA compliant with ARIA attributes
 * - **Responsive Design**: Adapts to different screen sizes with max-width and scrolling
 *
 * ## Accessibility
 *
 * The dialog implements full WCAG 2.1 AA compliance:
 *
 * - **Role**: `role="dialog"` with `aria-modal="true"`
 * - **Labels**: Properly labeled with `aria-labelledby` and `aria-describedby`
 * - **Keyboard Navigation**:
 *   - `ArrowUp`/`ArrowDown` - Navigate between targets
 *   - `Home`/`End` - Jump to first/last target
 *   - `Enter` or `Space` - Select focused target
 *   - `Escape` - Cancel and close dialog
 * - **Focus Management**: Automatically manages focus state across app cards
 *
 * ## Integration with FDC3 Broker
 *
 * This component is typically used by the FDC3 broker when resolving intents:
 *
 * ```typescript
 * broker.raiseIntent('ViewChart', context)
 *   // Multiple apps found -> show resolver
 *   // User selects app -> deliver intent
 * ```
 *
 * @example
 * ```typescript
 * function IntentResolver() {
 *   const [open, setOpen] = useState(true);
 *
 *   const targets: ResolverTarget[] = [
 *     {
 *       appId: 'chart-app-1',
 *       metadata: { appId: 'chart-app-1', name: 'Chart App 1', ... },
 *       currentContext: { type: 'fdc3.instrument', ... }
 *     },
 *     {
 *       appId: 'chart-app-2',
 *       metadata: { appId: 'chart-app-2', name: 'Chart App 2', ... }
 *     }
 *   ];
 *
 *   const handleSelect = (target: ResolverTarget) => {
 *     console.log('Selected app:', target.appId);
 *     setOpen(false);
 *   };
 *
 *   const handleCancel = () => {
 *     console.log('User cancelled');
 *     setOpen(false);
 *   };
 *
 *   return (
 *     <ResolverDialog
 *       open={open}
 *       intent="ViewChart"
 *       context={{ type: 'fdc3.instrument', id: { ticker: 'AAPL' } }}
 *       targets={targets}
 *       onSelect={handleSelect}
 *       onCancel={handleCancel}
 *     />
 *   );
 * }
 * ```
 *
 * ## Styling and Customization
 *
 * The component uses inline styles with a fixed design system:
 *
 * - **Backdrop**: Semi-transparent black overlay (`rgba(0, 0, 0, 0.5)`)
 * - **Dialog**: White background with rounded corners (12px), max-width 800px
 * - **Header**: Bold title with count of available apps
 * - **Cards**: Interactive app cards with hover and focus states
 * - **Typography**: Sans-serif with clear hierarchy (20px title, 14px body)
 *
 * To customize styling, you can:
 * 1. Fork the component and modify inline styles
 * 2. Use CSS-in-JS solutions (emotion, styled-components)
 * 3. Create a wrapper with CSS overrides
 *
 * ## Keyboard Navigation Details
 *
 * The component uses the {@link useResolverKeyboard} hook for navigation:
 *
 * - **Cyclic Navigation**: Arrow keys wrap around (bottom -> top, top -> bottom)
 * - **Home/End**: Jump to first or last item respectively
 * - **Enter/Space**: Activates the focused target
 * - **Escape**: Closes dialog via onCancel callback
 * - **Click Outside**: Backdrop click also triggers onCancel
 *
 * @see {@link AppCard} - Individual app target card component
 * @see {@link ContextPreview} - Context data preview component
 * @see {@link useResolverKeyboard} - Keyboard navigation hook
 * @see {@link ResolverDialogProps} - Component props interface
 */

import React, { useCallback } from 'react';
import { AppCard } from './AppCard';
import { ContextPreview } from './ContextPreview';
import type { ResolverDialogProps, ResolverTarget } from './types';
import { useResolverKeyboard } from './useResolverKeyboard';

/**
 * Resolver Dialog Component
 *
 * @param props - The resolver dialog props
 * @returns The resolver dialog component, or `null` when `open` is `false`
 */
export const ResolverDialog = ({
  open,
  intent,
  context,
  targets,
  onSelect,
  onCancel,
}: ResolverDialogProps): React.ReactElement | null => {
  const [selectedTarget, setSelectedTarget] = React.useState<ResolverTarget | null>(null);

  const focusedIndex = useResolverKeyboard({
    itemCount: targets.length,
    onSelect: (index) => {
      const target = targets[index];
      handleSelect(target);
    },
    onCancel,
    isOpen: open,
  });

  const handleSelect = useCallback(
    (target: ResolverTarget) => {
      setSelectedTarget(target);
      onSelect(target);
    },
    [onSelect],
  );

  const handleCancel = useCallback(() => {
    setSelectedTarget(null);
    onCancel();
  }, [onCancel]);

  const handleCardDoubleClick = useCallback(
    (target: ResolverTarget) => {
      handleSelect(target);
    },
    [handleSelect],
  );

  if (!open) {
    return null;
  }

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
      }}
      onClick={handleCancel}
      role="dialog"
      aria-modal="true"
      aria-labelledby="resolver-title"
      aria-describedby="resolver-description"
    >
      <div
        style={{
          backgroundColor: '#fff',
          borderRadius: '12px',
          padding: '24px',
          maxWidth: '800px',
          maxHeight: '80vh',
          overflowY: 'auto',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
        }}
        onClick={(e) => e.stopPropagation()}
        data-testid="resolver-content"
      >
        {/* Header */}
        <div
          style={{
            marginBottom: '16px',
          }}
        >
          <h2
            id="resolver-title"
            style={{
              fontSize: '20px',
              fontWeight: 600,
              margin: 0,
              color: '#333',
            }}
          >
            Select Application for {intent}
          </h2>
          <p
            id="resolver-description"
            style={{
              fontSize: '14px',
              color: '#666',
              marginTop: '8px',
            }}
          >
            {targets.length} application{targets.length > 1 ? 's' : ''} available
          </p>
        </div>

        {/* Context Preview */}
        <ContextPreview context={context} />

        {/* Instructions */}
        <div
          style={{
            fontSize: '12px',
            color: '#666',
            marginBottom: '16px',
            fontStyle: 'italic',
          }}
        >
          Use arrow keys to navigate, Enter to select, Escape to cancel
        </div>

        {/* App Cards */}
        <div
          role="listbox"
          aria-label="Available applications"
          style={{
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {targets.map((target, index) => (
            <AppCard
              key={target.instanceId || target.appId}
              app={target.metadata}
              instanceId={target.instanceId}
              currentContext={target.currentContext}
              selected={
                selectedTarget?.appId === target.appId &&
                selectedTarget?.instanceId === target.instanceId
              }
              focused={focusedIndex === index}
              onClick={() => handleSelect(target)}
              onDoubleClick={() => handleCardDoubleClick(target)}
              tabIndex={focusedIndex === index ? 0 : -1}
            />
          ))}
        </div>

        {/* Footer Actions */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '8px',
            marginTop: '16px',
          }}
        >
          <button
            onClick={handleCancel}
            style={{
              padding: '8px 16px',
              fontSize: '14px',
              fontWeight: 500,
              color: '#666',
              backgroundColor: '#f5f5f5',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResolverDialog;
