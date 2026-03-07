/**
 * Context Preview Component
 *
 * Displays FDC3 context data in a formatted, readable format within the resolver dialog.
 * This component allows users to verify the context data that will be delivered to
 * the selected application.
 *
 * ## Features
 *
 * - **Formatted JSON**: Pretty-prints context data with 2-space indentation
 * - **Monospace Font**: Uses monospace font for code-like readability
 * - **Scrollable Content**: Long context data wraps and breaks for readability
 * - **Visual Separation**: Clear visual hierarchy with headers and borders
 * - **Type Agnostic**: Works with any FDC3 context type
 *
 * ## Layout
 *
 * The component has a two-layer layout:
 *
 * 1. **Outer Container**: Gray background (`#f5f5f5`), 16px padding, rounded corners
 * 2. **Content Area**: White background with border for the JSON content
 *
 * The header displays "Context Data:" in bold (14px), followed by the formatted
 * JSON content in monospace font (12px).
 *
 * ## Usage in Resolver Dialog
 *
 * This component is typically used within {@link ResolverDialog} to show users
 * what data will be sent to the selected application:
 *
 * ```typescript
 * <ResolverDialog {...props}>
 *   <ContextPreview context={context} />
 *   {/* App cards rendered below *\/}
 * </ResolverDialog>
 * ```
 *
 * @example
 * ```typescript
 * function MyComponent() {
 *   const instrumentContext: Context = {
 *     type: 'fdc3.instrument',
 *     name: 'Apple Inc.',
 *     id: {
 *       ticker: 'AAPL',
 *       CUSIP: '037833100',
 *       ISIN: 'US0378331005'
 *     },
 *     market: {
 *       name: 'NASDAQ',
 *       MIC: 'XNAS'
 *     }
 *   };
 *
 *   return <ContextPreview context={instrumentContext} />;
 * }
 * ```
 *
 * The above will render:
 * ```
 * Context Data:
 * {
 *   "type": "fdc3.instrument",
 *   "name": "Apple Inc.",
 *   "id": {
 *     "ticker": "AAPL",
 *     "CUSIP": "037833100",
 *     "ISIN": "US0378331005"
 *   },
 *   "market": {
 *     "name": "NASDAQ",
 *     "MIC": "XNAS"
 *   }
 * }
 * ```
 *
 * ## Supported Context Types
 *
 * The component works with any FDC3 context type, including but not limited to:
 *
 * - `fdc3.instrument` - Financial instruments
 * - `fdc3.organization` - Organizations/companies
 * - `fdc3.contact` - Contact information
 * - `fdc3.country` - Geographic regions
 * - `fdc3.portfolio` - Portfolio holdings
 * - Custom context types - Any user-defined context
 *
 * ## Text Wrapping and Overflow
 *
 * The component handles long content gracefully:
 *
 * - **White Space**: `pre-wrap` preserves formatting while allowing wrapping
 * - **Word Break**: `break-all` ensures long strings break at any character
 * - **Scrolling**: Content can scroll if it exceeds the container height
 *
 * This ensures that even very long context data (e.g., complex portfolios)
 * remains readable.
 *
 * ## Styling and Customization
 *
 * The component uses inline styles with these design tokens:
 *
 * - **Container Background**: `#f5f5f5` (light gray)
 * - **Content Background**: `#fff` (white)
 * - **Border**: `1px solid #e0e0e0` (light gray)
 * - **Header Font**: 14px, 600 weight, `#333` color
 * - **Content Font**: 12px, monospace, `pre-wrap`
 * - **Border Radius**: 8px (container), 4px (content)
 * - **Padding**: 16px (container), 12px (content)
 *
 * @see {@link ResolverDialog} - Parent dialog component
 * @see {@link ContextPreviewProps} - Component props interface
 */

import type React from 'react';
import { Colors, ContextPreviewStyles } from './styles';
import type { ContextPreviewProps } from './types';

/**
 * Context Preview Component
 *
 * @param props - The context preview props
 * @returns A formatted display of the FDC3 context data
 */
export const ContextPreview: React.FC<ContextPreviewProps> = ({ context }) => {
  return (
    <div
      style={{
        padding: '16px',
        backgroundColor: Colors.backgroundLight,
        borderRadius: '8px',
        marginBottom: '16px',
      }}
    >
      <div style={ContextPreviewStyles.label}>Context Data:</div>
      <div style={ContextPreviewStyles.content}>{JSON.stringify(context, null, 2)}</div>
    </div>
  );
};

export default ContextPreview;
