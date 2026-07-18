import { useState } from 'react';
import {
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  List,
  ListOrdered,
  Undo,
  Redo,
  X,
} from 'lucide-react';

const RichTextEditor = ({
  value,
  onChange,
  label = '',
  supportingText = '',
  helperText = '',
  validationMessage = '',
  intent = 'neutral' as 'neutral' | 'error' | 'warning' | 'success',
  placeholder = '',
  disabled = false,
  readOnly = false,
  required = false,
  hasFunctions = true,
  hasCharacterCount = false,
  maxLength,
  minHeight = '160px',
}: {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  supportingText?: string;
  helperText?: string;
  validationMessage?: string;
  intent?: 'neutral' | 'error' | 'warning' | 'success';
  placeholder?: string;
  disabled?: boolean;
  readOnly?: boolean;
  required?: boolean;
  hasFunctions?: boolean;
  hasCharacterCount?: boolean;
  maxLength?: number;
  minHeight?: string;
}) => {
  const getBorderColor = () => {
    switch (intent) {
      case 'error':
        return 'var(--sc-color-red-500)';
      case 'warning':
        return 'var(--sc-color-amber-500)';
      case 'success':
        return 'var(--sc-color-green-600)';
      default:
        return 'var(--sc-color-grey-300)';
    }
  };

  const getValidationColor = () => {
    switch (intent) {
      case 'error':
        return 'var(--sc-color-red-550)';
      case 'warning':
        return 'var(--sc-color-amber-700)';
      case 'success':
        return 'var(--sc-color-green-700)';
      default:
        return 'var(--sc-color-foundation-content-helper-text)';
    }
  };

  const ToolbarButton = ({
    children,
    title,
  }: {
    children: React.ReactNode;
    title: string;
  }) => (
    <button
      title={title}
      disabled={disabled}
      style={{
        width: '32px',
        height: '32px',
        padding: 0,
        backgroundColor: 'transparent',
        color: 'var(--sc-color-grey-600)',
        border: 'none',
        borderRadius: '4px',
        cursor: disabled ? 'not-allowed' : 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'background-color 0.15s ease',
      }}
      onMouseEnter={(e) => {
        if (!disabled) {
          e.currentTarget.style.backgroundColor = 'var(--sc-color-grey-100)';
        }
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = 'transparent';
      }}
    >
      {children}
    </button>
  );

  const ToolbarDivider = () => (
    <div
      style={{
        width: '1px',
        height: '24px',
        backgroundColor: 'var(--sc-color-grey-300)',
        margin: '0 4px',
      }}
    />
  );

  return (
    <div>
      {label && (
        <div style={{ marginBottom: '8px' }}>
          <label
            style={{
              fontSize: 'var(--sc-text-label-main)',
              lineHeight: '16px',
              color: disabled
                ? 'var(--sc-color-grey-400)'
                : 'var(--sc-color-foundation-content-label-text)',
              display: 'block',
            }}
          >
            {label}
            {required && ' *'}
          </label>
          {supportingText && (
            <div
              style={{
                fontSize: 'var(--sc-text-description-main)',
                lineHeight: '16px',
                color: 'var(--sc-color-foundation-content-helper-text)',
                marginTop: '4px',
              }}
            >
              {supportingText}
            </div>
          )}
        </div>
      )}

      <div
        style={{
          border: readOnly ? 'none' : `1px solid ${getBorderColor()}`,
          borderRadius: '6px',
          backgroundColor: disabled
            ? 'var(--sc-color-grey-50)'
            : readOnly
              ? 'transparent'
              : 'var(--sc-color-white)',
          overflow: 'hidden',
        }}
      >
        {/* Toolbar */}
        {hasFunctions && !readOnly && (
          <div
            style={{
              padding: '8px 12px',
              display: 'flex',
              gap: '4px',
              alignItems: 'center',
              flexWrap: 'wrap',
              borderBottom: '1px solid var(--sc-color-grey-200)',
              backgroundColor: 'var(--sc-color-grey-50)',
            }}
          >
            <ToolbarButton title="Undo">
              <Undo size={16} />
            </ToolbarButton>
            <ToolbarButton title="Redo">
              <Redo size={16} />
            </ToolbarButton>

            <ToolbarDivider />

            <ToolbarButton title="Bold">
              <Bold size={16} />
            </ToolbarButton>
            <ToolbarButton title="Italic">
              <Italic size={16} />
            </ToolbarButton>
            <ToolbarButton title="Underline">
              <Underline size={16} />
            </ToolbarButton>

            <ToolbarDivider />

            <ToolbarButton title="Align left">
              <AlignLeft size={16} />
            </ToolbarButton>
            <ToolbarButton title="Align centre">
              <AlignCenter size={16} />
            </ToolbarButton>
            <ToolbarButton title="Align right">
              <AlignRight size={16} />
            </ToolbarButton>

            <ToolbarDivider />

            <ToolbarButton title="Bullet list">
              <List size={16} />
            </ToolbarButton>
            <ToolbarButton title="Numbered list">
              <ListOrdered size={16} />
            </ToolbarButton>
          </div>
        )}

        {/* Editor area */}
        <div style={{ position: 'relative' }}>
          <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            disabled={disabled}
            readOnly={readOnly}
            maxLength={maxLength}
            style={{
              width: '100%',
              minHeight: readOnly ? 'auto' : minHeight,
              padding:
                value && !disabled && !readOnly
                  ? '12px 40px 12px 12px'
                  : '12px',
              border: 'none',
              outline: 'none',
              fontSize: 'var(--sc-text-component-main)',
              lineHeight: '22px',
              color: disabled
                ? 'var(--sc-color-grey-400)'
                : 'var(--sc-color-foundation-content-input-text)',
              backgroundColor: 'transparent',
              resize: 'vertical',
              fontFamily: 'inherit',
            }}
          />
          {/* Clear button - only shown when typing (has value) and not disabled/readonly */}
          {value && !disabled && !readOnly && (
            <button
              onClick={() => {
                onChange('');
              }}
              style={{
                position: 'absolute',
                top: '12px',
                right: '12px',
                width: '20px',
                height: '20px',
                borderRadius: '50%',
                backgroundColor: 'var(--sc-color-grey-400)',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--sc-color-white)',
                transition: 'background-color 0.15s ease',
                padding: 0,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor =
                  'var(--sc-color-grey-500)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor =
                  'var(--sc-color-grey-400)';
              }}
              aria-label="Clear input"
            >
              <X size={12} />
            </button>
          )}
        </div>
      </div>

      {/* Helper text and character count */}
      {(helperText || hasCharacterCount) && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: '6px',
            fontSize: 'var(--sc-text-description-main)',
            lineHeight: '16px',
          }}
        >
          {helperText && (
            <div
              style={{
                color: 'var(--sc-color-foundation-content-helper-text)',
              }}
            >
              {helperText}
            </div>
          )}
          {hasCharacterCount && maxLength && (
            <div
              style={{
                color:
                  value.length > maxLength * 0.9
                    ? 'var(--sc-color-amber-700)'
                    : 'var(--sc-color-foundation-content-helper-text)',
                marginLeft: 'auto',
              }}
            >
              {value.length}/{maxLength}
            </div>
          )}
        </div>
      )}

      {/* Validation message */}
      {validationMessage && (
        <div
          style={{
            fontSize: 'var(--sc-text-description-main)',
            lineHeight: '16px',
            color: getValidationColor(),
            marginTop: '6px',
          }}
        >
          {validationMessage}
        </div>
      )}
    </div>
  );
};

export default function RichTextEditorShowcase() {
  const [content1, setContent1] = useState('');
  const [content2, setContent2] = useState('Enter your message here...');
  const maxChars = 500;

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
        Rich text editor
      </h2>

      <p
        style={{
          fontSize: 'var(--sc-text-paragraph-main)',
          lineHeight: '22px',
          color: 'var(--sc-color-foundation-content-body)',
          marginBottom: '32px',
        }}
      >
        Rich text editor enables users to compose and format text with common
        typographic controls. Container height: 160-240px, padding: 12px
        horizontal, border radius: 6px, toolbar gap: 8px.
      </p>

      {/* Basic editor */}
      <section style={{ marginBottom: '48px' }}>
        <h3
          style={{
            fontSize: 'var(--sc-text-title-main)',
            lineHeight: '26px',
            color: 'var(--sc-color-foundation-content-title)',
            marginBottom: '16px',
          }}
        >
          Basic rich text editor
        </h3>

        <div style={{ maxWidth: '600px' }}>
          <RichTextEditor
            value={content1}
            onChange={setContent1}
            label="Enter a message"
            helperText="Format your text using the toolbar above"
            placeholder="Start typing..."
          />
        </div>
      </section>

      {/* With character count */}
      <section style={{ marginBottom: '48px' }}>
        <h3
          style={{
            fontSize: 'var(--sc-text-title-main)',
            lineHeight: '26px',
            color: 'var(--sc-color-foundation-content-title)',
            marginBottom: '16px',
          }}
        >
          With character count
        </h3>

        <div style={{ maxWidth: '600px' }}>
          <RichTextEditor
            value={content2}
            onChange={setContent2}
            label="Leave a comment"
            supportingText="Share your thoughts or feedback"
            hasCharacterCount
            maxLength={maxChars}
            placeholder="Write your comment..."
          />
        </div>
      </section>

      {/* Without toolbar */}
      <section style={{ marginBottom: '48px' }}>
        <h3
          style={{
            fontSize: 'var(--sc-text-title-main)',
            lineHeight: '26px',
            color: 'var(--sc-color-foundation-content-title)',
            marginBottom: '16px',
          }}
        >
          Without toolbar
        </h3>

        <div style={{ maxWidth: '600px' }}>
          <RichTextEditor
            value=""
            onChange={() => {}}
            label="Simple text area"
            helperText="Plain text input without formatting options"
            placeholder="Enter text..."
            hasFunctions={false}
          />
        </div>
      </section>

      {/* Validation states */}
      <section style={{ marginBottom: '48px' }}>
        <h3
          style={{
            fontSize: 'var(--sc-text-title-main)',
            lineHeight: '26px',
            color: 'var(--sc-color-foundation-content-title)',
            marginBottom: '16px',
          }}
        >
          Validation states
        </h3>

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '24px',
            maxWidth: '600px',
          }}
        >
          <RichTextEditor
            value=""
            onChange={() => {}}
            label="Message *"
            required
            intent="error"
            validationMessage="This field is required"
            placeholder="Enter your message..."
          />

          <RichTextEditor
            value="This message has been successfully saved."
            onChange={() => {}}
            label="Feedback"
            intent="success"
            validationMessage="Changes saved"
            hasFunctions={false}
          />

          <RichTextEditor
            value="This content may contain sensitive information."
            onChange={() => {}}
            label="Content warning"
            intent="warning"
            validationMessage="Please review before publishing"
            hasFunctions={false}
          />
        </div>
      </section>

      {/* Disabled and read-only */}
      <section>
        <h3
          style={{
            fontSize: 'var(--sc-text-title-main)',
            lineHeight: '26px',
            color: 'var(--sc-color-foundation-content-title)',
            marginBottom: '16px',
          }}
        >
          Disabled and read-only states
        </h3>

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '24px',
            maxWidth: '600px',
          }}
        >
          <RichTextEditor
            value="This editor is disabled and cannot be edited."
            onChange={() => {}}
            label="Disabled editor"
            disabled
          />

          <RichTextEditor
            value="This is read-only content that cannot be modified. It displays without borders or background, suitable for viewing formatted text."
            onChange={() => {}}
            label="Read-only content"
            readOnly
          />
        </div>
      </section>
    </div>
  );
}
