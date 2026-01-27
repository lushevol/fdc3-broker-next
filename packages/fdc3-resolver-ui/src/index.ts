/**
 * @fm/fdc3-resolver-ui
 *
 * A React component library for FDC3 intent resolution UI.
 *
 * ## Overview
 *
 * This package provides user interface components for resolving FDC3 intents when
 * multiple target applications are available. It implements the FDC3 resolver pattern,
 * allowing users to visually select which application should handle an intent.
 *
 * ## Components
 *
 * - **ResolverDialog**: Main modal dialog for intent resolution
 * - **AppCard**: Individual application target card
 * - **ContextPreview**: Formatted display of FDC3 context data
 * - **useResolverKeyboard**: Keyboard navigation hook for WCAG compliance
 *
 * ## Usage
 *
 * ### Basic Example
 *
 * ```typescript
 * import { ResolverDialog } from '@fm/fdc3-resolver-ui';
 * import type { ResolverTarget } from '@fm/fdc3-resolver-ui';
 *
 * function MyResolver() {
 *   const [open, setOpen] = useState(false);
 *   const [intent, setIntent] = useState('');
 *   const [context, setContext] = useState<Context>(null);
 *   const [targets, setTargets] = useState<ResolverTarget[]>([]);
 *
 *   const handleSelect = (target: ResolverTarget) => {
 *     console.log('Selected:', target.appId);
 *     // Deliver intent to selected target
 *     setOpen(false);
 *   };
 *
 *   const handleCancel = () => {
 *     setOpen(false);
 *   };
 *
 *   return (
 *     <ResolverDialog
 *       open={open}
 *       intent={intent}
 *       context={context}
 *       targets={targets}
 *       onSelect={handleSelect}
 *       onCancel={handleCancel}
 *     />
 *   );
 * }
 * ```
 *
 * ### Integration with FDC3 Broker
 *
 * This UI is typically integrated with an FDC3 broker:
 *
 * ```typescript
 * import { ResolverDialog } from '@fm/fdc3-resolver-ui';
 * import type { ResolverTarget, Context } from '@fm/fdc3-resolver-ui';
 *
 * class FDC3Broker {
 *   async raiseIntent(intent: string, context: Context, target?: string) {
 *     const targets = await this.findTargets(intent, context);
 *
 *     if (targets.length === 0) {
 *       throw new Error('No targets found');
 *     }
 *
 *     if (targets.length === 1) {
 *       return this.deliverIntent(targets[0], intent, context);
 *     }
 *
 *     // Multiple targets - show resolver
 *     return new Promise((resolve, reject) => {
 *       const resolver = (
 *         <ResolverDialog
 *           open={true}
 *           intent={intent}
 *           context={context}
 *           targets={targets}
 *           onSelect={(target) => {
 *             this.deliverIntent(target, intent, context)
 *               .then(resolve)
 *               .catch(reject);
 *           }}
 *           onCancel={() => reject(new Error('User cancelled'))}
 *         />
 *       );
 *
 *       // Mount resolver to DOM
 *       this.mountResolver(resolver);
 *     });
 *   }
 * }
 * ```
 *
 * ## Accessibility
 *
 * All components in this package are WCAG 2.1 Level AA compliant:
 *
 * - **Keyboard Navigation**: Full keyboard support (Arrow keys, Enter, Escape, Home, End)
 * - **ARIA Attributes**: Proper roles, labels, and states
 * - **Focus Management**: Logical focus order and visible focus indicators
 * - **Screen Readers**: Semantic markup for assistive technologies
 * - **Color Contrast**: Meets AA standards for text and borders
 *
 * ## Styling
 *
 * Components use inline styles with a consistent design system:
 *
 * - **Primary Color**: Blue (#1976d2)
 * - **Focus Color**: Light Blue (#42a5f5)
 * - **Border Color**: Gray (#e0e0e0)
 * - **Typography**: Sans-serif with clear hierarchy
 * - **Spacing**: Consistent padding and margins
 * - **Border Radius**: Rounded corners (4-12px)
 *
 * Customization can be done by:
 * 1. Forking components and modifying inline styles
 * 2. Using CSS-in-JS libraries (emotion, styled-components)
 * 3. Overriding CSS classes (where available)
 *
 * ## Type Safety
 *
 * This package is fully typed with TypeScript. Exported types include:
 *
 * - `ResolverTarget` - Target application data structure
 * - `ResolverDialogProps` - Resolver dialog component props
 * - `AppCardProps` - App card component props
 * - `ContextPreviewProps` - Context preview component props
 *
 * ## Browser Support
 *
 * - Modern browsers (Chrome, Firefox, Safari, Edge)
 * - React 17+ required
 * - No external dependencies for UI components
 *
 * @packageDocumentation
 */

export { AppCard } from './AppCard';
export { ContextPreview } from './ContextPreview';
// Export lazy loading utilities
export {
  lazyAppCard,
  lazyContextPreview,
  lazyResolverDialog,
  preloadResolver,
  ResolverSuspense,
} from './lazy';
// Export components
export { ResolverDialog } from './ResolverDialog';
export type { ResolverErrorBoundaryProps } from './ResolverErrorBoundary';

// Export Error Boundary
export { ResolverErrorBoundary } from './ResolverErrorBoundary';
// Export all types
export * from './types';
// Export hooks
export { useResolverKeyboard } from './useResolverKeyboard';
