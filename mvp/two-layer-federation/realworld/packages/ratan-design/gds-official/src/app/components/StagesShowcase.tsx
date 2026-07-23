import { useState } from 'react';
import { Check, AlertTriangle, MoreHorizontal } from 'lucide-react';
import svgPaths from '../../imports/svg-bk2wl65qth';

export default function StagesShowcase() {
  const [showTruncatedDropdown, setShowTruncatedDropdown] = useState(false);
  const [selectedStage, setSelectedStage] = useState(1);

  const StageItem = ({
    stepNumber,
    label,
    description = '',
    intent = 'neutral' as 'neutral' | 'success' | 'error',
    isActive = false,
    isFirst = false,
    isLast = false,
    isTruncated = false,
    trailingContent,
    disabled = false,
    onClick,
  }: {
    stepNumber: number | string;
    label: string;
    description?: string;
    intent?: 'neutral' | 'success' | 'error';
    isActive?: boolean;
    isFirst?: boolean;
    isLast?: boolean;
    isTruncated?: boolean;
    trailingContent?: React.ReactNode;
    disabled?: boolean;
    onClick?: () => void;
  }) => {
    const getBorderColor = () => {
      if (intent === 'success') return 'var(--sc-color-green-500)';
      if (intent === 'error') return 'var(--sc-color-red-500)';
      if (isActive) return 'var(--sc-color-blue-500)';
      return 'var(--sc-color-grey-300)';
    };

    const getBackgroundColor = () => {
      if (disabled) return 'var(--sc-color-grey-100)';
      if (isActive) return 'var(--sc-color-blue-500)';
      return 'var(--sc-color-white)';
    };

    const getTextColor = () => {
      if (disabled) return 'var(--sc-color-grey-400)';
      if (isActive) return 'var(--sc-color-white)';
      return 'var(--sc-color-foundation-content-body)';
    };

    const getDescriptionColor = () => {
      if (isActive) return 'rgba(255, 255, 255, 0.85)';
      return 'var(--sc-color-foundation-content-helper-text)';
    };

    const getIconBadgeColor = () => {
      if (isActive) return 'var(--sc-color-white)';
      if (intent === 'success') return 'var(--sc-color-green-600)';
      if (intent === 'error') return 'var(--sc-color-red-600)';
      return 'var(--sc-color-blue-600)';
    };

    const getIconBadgeBorderColor = () => {
      if (isActive) return 'var(--sc-color-white)';
      if (intent === 'success') return 'var(--sc-color-green-500)';
      if (intent === 'error') return 'var(--sc-color-red-500)';
      return 'var(--sc-color-blue-500)';
    };

    // Get SVG path and stroke color for the end joint (right arrow)
    const getEndJointPath = () => {
      if (isActive) {
        return svgPaths.p1a3fec00; // No stroke for active
      }
      // Use stroked version for inactive stages
      return svgPaths.pc1ae680;
    };

    // Get SVG path and stroke color for the front joint (left notch)
    const getFrontJointPath = () => {
      if (isActive) {
        return svgPaths.pe5fbc80; // No stroke for active
      }
      // Use stroked version for inactive stages
      return svgPaths.p2d093cf0;
    };

    const shouldShowBorder = !isActive;

    return (
      <div
        style={{
          display: 'flex',
          flex: isTruncated ? '0 0 auto' : '1 0 0',
          alignItems: 'center',
          minHeight: '1px',
          minWidth: isTruncated ? '60px' : '104px',
          marginRight: '-8px',
          paddingRight: '2px',
          position: 'relative',
          borderRadius: '6px',
          cursor: onClick && !disabled ? 'pointer' : 'default',
          opacity: disabled ? 0.6 : 1,
        }}
        onClick={onClick && !disabled ? onClick : undefined}
        role={onClick ? 'button' : undefined}
        tabIndex={onClick && !disabled ? 0 : undefined}
      >
        {/* Front Joint (left arrow notch) - hidden for first item */}
        {!isFirst && (
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              alignSelf: 'stretch',
            }}
          >
            <div
              style={{
                height: '100%',
                marginRight: '-2px',
                position: 'relative',
                flexShrink: 0,
                width: '18px',
              }}
            >
              <svg
                style={{ display: 'block', width: '100%', height: '100%' }}
                fill="none"
                preserveAspectRatio="none"
                viewBox="0 0 17.9998 56"
              >
                <path
                  d={getFrontJointPath()}
                  fill={getBackgroundColor()}
                  stroke={shouldShowBorder ? getBorderColor() : undefined}
                  strokeWidth={shouldShowBorder ? '1' : undefined}
                />
              </svg>
            </div>
          </div>
        )}

        {/* Main content container */}
        <div
          style={{
            display: 'flex',
            flex: '1 0 0',
            alignItems: 'center',
            minHeight: '1px',
            minWidth: '1px',
            marginRight: '-2px',
            paddingRight: '2px',
            position: 'relative',
            isolation: 'isolate',
          }}
        >
          {/* Content (with border for inactive stages) */}
          <div
            style={{
              backgroundColor: getBackgroundColor(),
              display: 'flex',
              flex: '1 0 0',
              gap: '4px',
              alignItems: 'center',
              minHeight: '1px',
              minWidth: '1px',
              marginRight: '-2px',
              padding: '8px 0',
              position: 'relative',
              zIndex: 2,
              borderTop: shouldShowBorder
                ? `1px solid ${getBorderColor()}`
                : 'none',
              borderBottom: shouldShowBorder
                ? `1px solid ${getBorderColor()}`
                : 'none',
              borderLeft:
                shouldShowBorder && isFirst
                  ? `1px solid ${getBorderColor()}`
                  : 'none',
              borderTopLeftRadius: isFirst ? '6px' : '0',
              borderBottomLeftRadius: isFirst ? '6px' : '0',
            }}
          >
            {/* Number/Icon Container */}
            {!isTruncated && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  minHeight: '40px',
                  paddingLeft: '8px',
                  position: 'relative',
                  borderRadius: '32px',
                  flexShrink: 0,
                }}
              >
                <div
                  style={{
                    position: 'relative',
                    borderRadius: '32px',
                    flexShrink: 0,
                    width: '28px',
                    height: '28px',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      overflow: 'hidden',
                      position: 'relative',
                      borderRadius: 'inherit',
                      width: '100%',
                      height: '100%',
                    }}
                  >
                    {intent === 'success' ? (
                      <Check size={16} style={{ color: getIconBadgeColor() }} />
                    ) : intent === 'error' ? (
                      <AlertTriangle
                        size={16}
                        style={{ color: getIconBadgeColor() }}
                      />
                    ) : (
                      <div
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'center',
                          fontFamily: 'SC Prosper Sans',
                          fontWeight: '500',
                          lineHeight: '0',
                          maxHeight: '10px',
                          minWidth: '10px',
                          position: 'relative',
                          flexShrink: 0,
                          fontSize: '18px',
                          textAlign: 'center',
                          color: getIconBadgeColor(),
                          whiteSpace: 'nowrap',
                        }}
                      >
                        <p style={{ margin: 0, lineHeight: '26px' }}>
                          {stepNumber}
                        </p>
                      </div>
                    )}
                  </div>
                  {/* Border around icon */}
                  <div
                    aria-hidden="true"
                    style={{
                      position: 'absolute',
                      border: `1.8px solid ${getIconBadgeBorderColor()}`,
                      inset: 0,
                      pointerEvents: 'none',
                      borderRadius: '32px',
                    }}
                  />
                </div>
              </div>
            )}

            {/* Truncated ellipsis icon */}
            {isTruncated && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  minHeight: '40px',
                  paddingLeft: '8px',
                  flexShrink: 0,
                }}
              >
                <MoreHorizontal size={20} style={{ color: getTextColor() }} />
              </div>
            )}

            {/* Text Container */}
            {!isTruncated && (
              <div
                style={{
                  flex: '1 0 0',
                  minHeight: '40px',
                  minWidth: '1px',
                  position: 'relative',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    minHeight: 'inherit',
                    width: '100%',
                    height: '100%',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'flex-start',
                      justifyContent: 'center',
                      minHeight: 'inherit',
                      paddingLeft: '8px',
                      position: 'relative',
                      width: '100%',
                    }}
                  >
                    {/* Label */}
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        minHeight: '24px',
                        position: 'relative',
                        flexShrink: 0,
                        width: '100%',
                      }}
                    >
                      <p
                        style={{
                          flex: '1 0 0',
                          fontFamily: 'SC Prosper Sans',
                          fontWeight: '500',
                          lineHeight: '22px',
                          minHeight: '1px',
                          minWidth: '1px',
                          position: 'relative',
                          fontSize: '14px',
                          color: getTextColor(),
                          whiteSpace: 'pre-wrap',
                          margin: 0,
                        }}
                      >
                        {label}
                      </p>
                      {/* Trailing content */}
                      {trailingContent && (
                        <span
                          style={{
                            fontFamily: 'SC Prosper Sans',
                            fontSize: '12px',
                            lineHeight: '16px',
                            color: getDescriptionColor(),
                            marginLeft: '8px',
                            flexShrink: 0,
                          }}
                        >
                          {trailingContent}
                        </span>
                      )}
                    </div>
                    {/* Description */}
                    {description && (
                      <p
                        style={{
                          fontFamily: 'SC Prosper Sans',
                          fontWeight: '400',
                          lineHeight: '16px',
                          position: 'relative',
                          flexShrink: 0,
                          fontSize: '12px',
                          color: getDescriptionColor(),
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          width: '100%',
                          whiteSpace: 'nowrap',
                          margin: 0,
                        }}
                      >
                        {description}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* End Joint (right arrow) */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              alignSelf: 'stretch',
            }}
          >
            <div
              style={{
                height: '100%',
                marginRight: '-2px',
                position: 'relative',
                flexShrink: 0,
                width: '20.506px',
                zIndex: 1,
              }}
            >
              <svg
                style={{ display: 'block', width: '100%', height: '100%' }}
                fill="none"
                preserveAspectRatio="none"
                viewBox="0 0 20.5064 56"
              >
                <path
                  d={getEndJointPath()}
                  fill={getBackgroundColor()}
                  stroke={shouldShowBorder ? getBorderColor() : undefined}
                  strokeWidth={shouldShowBorder ? '1' : undefined}
                />
              </svg>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const StagesContainer = ({ children }: { children: React.ReactNode }) => (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-start',
        paddingRight: '8px',
        position: 'relative',
        width: '100%',
        height: '100%',
      }}
    >
      {children}
    </div>
  );

  return (
    <div>
      <h2
        style={{
          fontSize: 'var(--sc-text-section-main)',
          lineHeight: '44px',
          color: 'var(--sc-color-foundation-content-header)',
          marginBottom: '24px',
        }}
      >
        Stages
      </h2>

      <p
        style={{
          fontSize: 'var(--sc-text-paragraph-main)',
          lineHeight: '22px',
          color: 'var(--sc-color-foundation-content-body)',
          marginBottom: '32px',
        }}
      >
        Horizontal step-based progress indicator with arrow-shaped pills in a
        ribbon-like manner. Stacking of stages have arrows parallel to each
        other, similar to double chevron. Selected/current stage highlighted in
        solid blue, subsequent stages with grey borders.
      </p>

      {/* Two stages */}
      <section style={{ marginBottom: '48px' }}>
        <h3
          style={{
            fontSize: 'var(--sc-text-title-main)',
            lineHeight: '26px',
            color: 'var(--sc-color-foundation-content-title)',
            marginBottom: '16px',
          }}
        >
          Two stages
        </h3>

        <StagesContainer>
          <StageItem
            stepNumber={1}
            label="Application review"
            description="Reviewing your application"
            isActive
            isFirst
          />
          <StageItem
            stepNumber={2}
            label="Final approval"
            description="Pending approval"
            isLast
          />
        </StagesContainer>
      </section>

      {/* Three stages */}
      <section style={{ marginBottom: '48px' }}>
        <h3
          style={{
            fontSize: 'var(--sc-text-title-main)',
            lineHeight: '26px',
            color: 'var(--sc-color-foundation-content-title)',
            marginBottom: '16px',
          }}
        >
          Three stages
        </h3>

        <StagesContainer>
          <StageItem
            stepNumber={1}
            label="Know your customer"
            description="Identity verification"
            intent="success"
            isFirst
            onClick={() => console.log('Stage 1')}
          />
          <StageItem
            stepNumber={2}
            label="Document review"
            description="Reviewing documents"
            isActive
          />
          <StageItem
            stepNumber={3}
            label="Account setup"
            description="Create credentials"
            isLast
          />
        </StagesContainer>
      </section>

      {/* Four stages */}
      <section style={{ marginBottom: '48px' }}>
        <h3
          style={{
            fontSize: 'var(--sc-text-title-main)',
            lineHeight: '26px',
            color: 'var(--sc-color-foundation-content-title)',
            marginBottom: '16px',
          }}
        >
          Four stages
        </h3>

        <StagesContainer>
          <StageItem
            stepNumber={1}
            label="Application"
            description="Submitted"
            intent="success"
            isFirst
          />
          <StageItem
            stepNumber={2}
            label="Verification"
            description="In progress"
            isActive
            trailingContent="50%"
          />
          <StageItem stepNumber={3} label="Approval" description="Pending" />
          <StageItem
            stepNumber={4}
            label="Complete"
            description="Account ready"
            isLast
          />
        </StagesContainer>
      </section>

      {/* Five stages */}
      <section style={{ marginBottom: '48px' }}>
        <h3
          style={{
            fontSize: 'var(--sc-text-title-main)',
            lineHeight: '26px',
            color: 'var(--sc-color-foundation-content-title)',
            marginBottom: '16px',
          }}
        >
          Five stages
        </h3>

        <StagesContainer>
          <StageItem
            stepNumber={1}
            label="Lead qualification"
            description="Complete"
            intent="success"
            isFirst
          />
          <StageItem
            stepNumber={2}
            label="Proposal"
            description="Sent"
            intent="success"
          />
          <StageItem
            stepNumber={3}
            label="Negotiation"
            description="Active"
            isActive
            trailingContent="In progress"
          />
          <StageItem
            stepNumber={4}
            label="Contract"
            description="Not started"
          />
          <StageItem
            stepNumber={5}
            label="Closing"
            description="Pending"
            isLast
          />
        </StagesContainer>
      </section>

      {/* With truncation */}
      <section style={{ marginBottom: '48px' }}>
        <h3
          style={{
            fontSize: 'var(--sc-text-title-main)',
            lineHeight: '26px',
            color: 'var(--sc-color-foundation-content-title)',
            marginBottom: '16px',
          }}
        >
          With truncation
        </h3>

        <div style={{ position: 'relative' }}>
          <StagesContainer>
            <StageItem
              stepNumber={1}
              label="Initial assessment"
              description="Complete"
              intent="success"
              isFirst
            />
            <StageItem
              stepNumber="..."
              label=""
              isTruncated
              onClick={() => setShowTruncatedDropdown(!showTruncatedDropdown)}
            />
            <StageItem
              stepNumber={5}
              label="Final decision"
              description="In progress"
              isActive
              isLast
            />
          </StagesContainer>

          {/* Truncation dropdown */}
          {showTruncatedDropdown && (
            <div
              style={{
                position: 'absolute',
                top: 'calc(100% + 8px)',
                left: '50%',
                transform: 'translateX(-50%)',
                backgroundColor: 'var(--sc-color-white)',
                border: '1px solid var(--sc-color-grey-300)',
                borderRadius: '6px',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                padding: '8px',
                zIndex: 1000,
                minWidth: '200px',
              }}
            >
              <button
                onClick={() => {
                  setSelectedStage(2);
                  setShowTruncatedDropdown(false);
                }}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  border: 'none',
                  backgroundColor: 'transparent',
                  textAlign: 'left',
                  cursor: 'pointer',
                  borderRadius: '4px',
                  fontSize: 'var(--sc-text-component-main)',
                  lineHeight: '22px',
                  color: 'var(--sc-color-foundation-content-body)',
                  fontFamily: 'SC Prosper Sans',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor =
                    'var(--sc-color-grey-50)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                <strong>2.</strong> Credit check
              </button>
              <button
                onClick={() => {
                  setSelectedStage(3);
                  setShowTruncatedDropdown(false);
                }}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  border: 'none',
                  backgroundColor: 'transparent',
                  textAlign: 'left',
                  cursor: 'pointer',
                  borderRadius: '4px',
                  fontSize: 'var(--sc-text-component-main)',
                  lineHeight: '22px',
                  color: 'var(--sc-color-foundation-content-body)',
                  fontFamily: 'SC Prosper Sans',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor =
                    'var(--sc-color-grey-50)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                <strong>3.</strong> Risk assessment
              </button>
              <button
                onClick={() => {
                  setSelectedStage(4);
                  setShowTruncatedDropdown(false);
                }}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  border: 'none',
                  backgroundColor: 'transparent',
                  textAlign: 'left',
                  cursor: 'pointer',
                  borderRadius: '4px',
                  fontSize: 'var(--sc-text-component-main)',
                  lineHeight: '22px',
                  color: 'var(--sc-color-foundation-content-body)',
                  fontFamily: 'SC Prosper Sans',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor =
                    'var(--sc-color-grey-50)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                <strong>4.</strong> Documentation review
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Error state */}
      <section style={{ marginBottom: '48px' }}>
        <h3
          style={{
            fontSize: 'var(--sc-text-title-main)',
            lineHeight: '26px',
            color: 'var(--sc-color-foundation-content-title)',
            marginBottom: '16px',
          }}
        >
          With error state
        </h3>

        <StagesContainer>
          <StageItem
            stepNumber={1}
            label="Application"
            description="Submitted"
            intent="success"
            isFirst
          />
          <StageItem
            stepNumber={2}
            label="Document verification"
            description="Unable to verify"
            intent="error"
            trailingContent="Action required"
            onClick={() => console.log('Fix error')}
          />
          <StageItem
            stepNumber={3}
            label="Final review"
            description="Not started"
            disabled
            isLast
          />
        </StagesContainer>
      </section>

      {/* Clickable stages */}
      <section style={{ marginBottom: '48px' }}>
        <h3
          style={{
            fontSize: 'var(--sc-text-title-main)',
            lineHeight: '26px',
            color: 'var(--sc-color-foundation-content-title)',
            marginBottom: '16px',
          }}
        >
          Clickable stages
        </h3>

        <StagesContainer>
          <StageItem
            stepNumber={1}
            label="Order placed"
            description="3 Nov 2024"
            intent="success"
            isFirst
            onClick={() => console.log('View order details')}
          />
          <StageItem
            stepNumber={2}
            label="Processing"
            description="Currently processing"
            isActive
            onClick={() => console.log('View processing')}
          />
          <StageItem
            stepNumber={3}
            label="Shipped"
            description="Not yet shipped"
            onClick={() => console.log('View shipping')}
          />
          <StageItem
            stepNumber={4}
            label="Delivered"
            description="Expected 8 Nov 2024"
            isLast
            onClick={() => console.log('View delivery')}
          />
        </StagesContainer>
      </section>

      {/* Static (read-only) */}
      <section>
        <h3
          style={{
            fontSize: 'var(--sc-text-title-main)',
            lineHeight: '26px',
            color: 'var(--sc-color-foundation-content-title)',
            marginBottom: '16px',
          }}
        >
          Static stages
        </h3>

        <StagesContainer>
          <StageItem
            stepNumber={1}
            label="Data collection"
            description="Complete"
            intent="success"
            isFirst
          />
          <StageItem
            stepNumber={2}
            label="Analysis"
            description="In progress"
            isActive
            trailingContent="75%"
          />
          <StageItem
            stepNumber={3}
            label="Report generation"
            description="Pending"
            isLast
          />
        </StagesContainer>
      </section>
    </div>
  );
}
