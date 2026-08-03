---
description: 'This custom agent implements comprehensive UI validation for SC WebKit components including regex patterns, length constraints, and custom validation rules.'
tools: []
---

# Step 4 - Implement UI Validation

## Purpose
Implement robust form validation for SC WebKit components using component-specific validation attributes, reactive state management, custom regex patterns, and length constraints to ensure data integrity and improve user experience.

## Usage
Invoke the agent and implement validation for form fields according to the specifications outlined in the implementation protocol:

```
@Step 4 Implement UI Validation
```

### Prompt Templates

**Simple Version (Minimal):**
```
@Step 4 Implement UI Validation for these fields:

1. clientName - text, required, max 100 chars, letters only
2. loanAmount - number, required, min 0, max 1000000
3. email - email format, required
4. phone - phone format, optional
```

**Detailed Version (Comprehensive):**
```
@Step 4 Implement UI Validation

Fields to validate:

**Client Name**
- Type: text
- Required: yes
- Max length: 100
- Pattern: letters, spaces, hyphens, apostrophes only
- Error: "Client name is required and must contain only letters"

**Loan Amount**
- Type: number
- Required: yes
- Min: 0
- Max: 1,000,000
- Error: "Enter amount between $0 and $1,000,000"

**Email Address**
- Type: email
- Required: yes
- Pattern: valid email format
- Error: "Please enter a valid email address"

**Phone Number**
- Type: phone
- Required: no
- Pattern: US format (555) 555-5555
- Error: "Invalid phone format"

**Start Date**
- Type: date
- Required: yes
- Min: 2024-01-01
- Max: 2030-12-31
- Error: "Date must be between 2024 and 2030"
```

**Super Simple List:**
```
@Step 4 Implement UI Validation

Validate these fields in files:
- clientName: required, text, max 100
- loanAmount: required, number, 0-1000000
- email: required, email format
- phone: optional, phone format
- startDate: required, date, 2024-2030
```

### Input
- Component files requiring validation
- Form field specifications (using any prompt template above)
- Business rules and constraints
- Data type requirements

### Output
- Form components with complete validation
- Custom validation patterns
- Error handling implementation
- Validation feedback mechanisms

## Implementation Protocol

### 1. Identify Validation Requirements

Analyze each form field to determine:
- **Required Fields**: Fields that must have a value
- **Data Type**: Text, email, number, phone, date, etc.
- **Length Constraints**: Minimum and maximum character limits
- **Format Requirements**: Regex patterns for specific formats
- **Business Rules**: Custom validation logic

### 2. SC WebKit Validation Attributes

**Core Validation Attributes:**

| Component | Attribute | Purpose | Example |
|-----------|-----------|---------|----------|
| `sc-input-group` | `required` | Marks field as mandatory | `<sc-input-group required>` |
| `sc-input-group` | `error` | Shows error state | `?error="${this.hasError}"` |
| `sc-input-group` | `error-message` | Error text to display | `error-message="${this.errorMsg}"` |
| `sc-input-group` | `success` | Shows success state | `?success="${this.isValid}"` |
| `sc-input-group` | `success-message` | Success text to display | `success-message="Valid entry"` |
| `sc-input-group` | `help-text` | Guidance text | `help-text="Enter your name"` |
| `sc-text-input` | `max-length` | Character limit | `max-length="100"` |
| `sc-text-input` | `show-character-count` | Display count | `show-character-count` |
| `sc-number-input` | `min` | Minimum value | `min="0"` |
| `sc-number-input` | `max` | Maximum value | `max="100"` |
| `sc-number-input` | `step` | Increment value | `step="0.1"` |
| `sc-date-input` | `min` | Earliest date | `min="2020-01-01"` |
| `sc-date-input` | `max` | Latest date | `max="2030-12-31"` |

**Attribute Binding Syntax:**
- **Boolean attributes**: Use `?` prefix for reactive binding: `?error="${this.hasError}"`
- **String attributes**: Use direct binding: `error-message="${this.errorMsg}"`
- **Static values**: No binding needed: `max-length="100"`

**Basic Examples:**
```html
<!-- Static required field with max length -->
<sc-input-group label="Username" required>
  <sc-text-input max-length="50" show-character-count></sc-text-input>
</sc-input-group>

<!-- Reactive error state (use in LitElement render) -->
<sc-input-group 
  label="Email"
  required
  ?error="${this.emailError}"
  error-message="${this.emailErrorMsg}">
  <sc-email-input @blur="${this.handleEmailBlur}"></sc-email-input>
</sc-input-group>

<!-- Number input with constraints -->
<sc-input-group label="Age" required>
  <sc-number-input min="0" max="100" step="1"></sc-number-input>
</sc-input-group>
```

### 3. Field-Specific Validation Rules

#### Text Fields with SC WebKit
```html
<!-- Name field with max length -->
<sc-input-group 
  label="Full Name"
  required
  help-text="Letters, spaces, hyphens, and apostrophes only">
  <sc-text-input 
    max-length="100"
    show-character-count>
  </sc-text-input>
</sc-input-group>

<!-- Email field with validation -->
<sc-input-group 
  label="Email Address"
  required
  ?error="${this.emailError}"
  error-message="${this.emailErrorMsg}">
  <sc-email-input @blur="${this.handleEmailBlur}"></sc-email-input>
</sc-input-group>

<!-- Phone field with formatting -->
<sc-input-group 
  label="Phone Number"
  required
  help-text="Format: (555) 555-5555">
  <sc-formatted-input 
    mask="(000) 000-0000">
  </sc-formatted-input>
</sc-input-group>
```

#### Number Fields with SC WebKit
```html
<!-- Amount field -->
<sc-input-group 
  label="Loan Amount"
  required
  ?error="${this.amountError}"
  error-message="${this.amountErrorMsg}">
  <sc-number-input 
    min="0"
    max="1000000"
    step="1000"
    prefix-icon="currency-dollar"
    @blur="${this.handleAmountBlur}">
  </sc-number-input>
</sc-input-group>

<!-- Percentage field -->
<sc-input-group 
  label="Interest Rate"
  required>
  <sc-number-input 
    min="0"
    max="100"
    step="0.1"
    suffix-label="%">
  </sc-number-input>
</sc-input-group>
```

#### Date Fields with SC WebKit
```html
<!-- Date field -->
<sc-input-group 
  label="Start Date"
  required
  ?error="${this.dateError}"
  error-message="${this.dateErrorMsg}">
  <sc-date-input 
    min="2020-01-01"
    max="2030-12-31"
    @blur="${this.handleDateBlur}">
  </sc-date-input>
</sc-input-group>

<!-- Time field -->
<sc-input-group 
  label="Meeting Time"
  required>
  <sc-time-input></sc-time-input>
</sc-input-group>
```

### 5. Validation Implementation Pattern

**Step-by-Step Implementation:**

1. **Define validation state properties** using `@state()` decorator
2. **Create validator functions** for reusable validation logic
3. **Implement event handlers** for blur events
4. **Bind reactive properties** to `sc-input-group` attributes
5. **Add form-level validation** before submission

**Implementation Code:**

```typescript
// Validation state interface
interface ValidationState {
  isValid: boolean;
  errorMessage: string;
}

// Custom validation functions (create once, reuse across component)
const validators = {
  email: (value: string): ValidationState => {
    const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
    return {
      isValid: emailRegex.test(value),
      errorMessage: 'Please enter a valid email address'
    };
  },
  
  phone: (value: string): ValidationState => {
    const phoneRegex = /^\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}$/;
    return {
      isValid: phoneRegex.test(value),
      errorMessage: 'Please enter a valid phone number (e.g., (555) 555-5555)'
    };
  },
  
  minLength: (value: string, min: number): ValidationState => {
    return {
      isValid: value.length >= min,
      errorMessage: `Minimum ${min} characters required`
    };
  },
  
  numberRange: (value: number, min: number, max: number): ValidationState => {
    if (value < min) {
      return { isValid: false, errorMessage: `Value must be at least ${min}` };
    }
    if (value > max) {
      return { isValid: false, errorMessage: `Value must not exceed ${max}` };
    }
    return { isValid: true, errorMessage: '' };
  },
  
  required: (value: string): ValidationState => {
    return {
      isValid: value.trim().length > 0,
      errorMessage: 'This field is required'
    };
  }
};

// Reactive properties for validation state
@state()
private emailError = false;
@state()
private emailErrorMessage = '';

@state()
private amountError = false;
@state()
private amountErrorMessage = '';

// Validation handler for email
private handleEmailValidation(e: Event): void {
  const input = e.target as HTMLInputElement;
  const value = input.value;
  
  const result = validators.email(value);
  this.emailError = !result.isValid;
  this.emailErrorMessage = result.errorMessage;
}

// Validation handler for amount
private handleAmountValidation(e: Event): void {
  const input = e.target as HTMLInputElement;
  const value = parseFloat(input.value);
  
  if (isNaN(value)) {
    this.amountError = true;
    this.amountErrorMessage = 'Please enter a valid number';
    return;
  }
  
  const result = validators.numberRange(value, 0, 1000000);
  this.amountError = !result.isValid;
  this.amountErrorMessage = result.errorMessage;
}

// Form-level validation
private validateForm(): boolean {
  let isValid = true;
  
  // Trigger validation on all fields
  const inputs = this.shadowRoot?.querySelectorAll('sc-text-input, sc-number-input, sc-email-input');
  inputs?.forEach(input => {
    input.dispatchEvent(new Event('blur'));
  });
  
  // Check all error states
  if (this.emailError || this.amountError) {
    isValid = false;
  }
  
  return isValid;
}
```

### 6. Complete Component Integration

**Validation Workflow:**
1. User fills field → no validation
2. User leaves field (blur) → validation runs → state updates
3. Template re-renders with error/success state
4. User corrects input → error clears on next blur
5. Form submit → all fields validated → focus first error if any

**Full LitElement Example:**

```typescript
class CreditTermSheet extends LitElement {
  
  // Validation state properties
  @state() private clientNameError = false;
  @state() private clientNameErrorMsg = '';
  
  @state() private emailError = false;
  @state() private emailErrorMsg = '';
  
  @state() private loanAmountError = false;
  @state() private loanAmountErrorMsg = '';
  
  // Event handlers for real-time validation
  private handleClientNameBlur(e: Event): void {
    const input = e.target as HTMLInputElement;
    const value = input.value.trim();
    
    if (!value) {
      this.clientNameError = true;
      this.clientNameErrorMsg = 'Client name is required';
    } else if (value.length < 2) {
      this.clientNameError = true;
      this.clientNameErrorMsg = 'Name must be at least 2 characters';
    } else {
      this.clientNameError = false;
      this.clientNameErrorMsg = '';
    }
  }
  
  private handleEmailBlur(e: Event): void {
    const input = e.target as HTMLInputElement;
    const value = input.value.trim();
    const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
    
    if (!value) {
      this.emailError = true;
      this.emailErrorMsg = 'Email is required';
    } else if (!emailRegex.test(value)) {
      this.emailError = true;
      this.emailErrorMsg = 'Please enter a valid email address';
    } else {
      this.emailError = false;
      this.emailErrorMsg = '';
    }
  }
  
  private handleLoanAmountBlur(e: Event): void {
    const input = e.target as HTMLInputElement;
    const value = parseFloat(input.value);
    
    if (isNaN(value) || value <= 0) {
      this.loanAmountError = true;
      this.loanAmountErrorMsg = 'Please enter a valid amount';
    } else if (value < 1000) {
      this.loanAmountError = true;
      this.loanAmountErrorMsg = 'Minimum loan amount is $1,000';
    } else if (value > 10000000) {
      this.loanAmountError = true;
      this.loanAmountErrorMsg = 'Maximum loan amount is $10,000,000';
    } else {
      this.loanAmountError = false;
      this.loanAmountErrorMsg = '';
    }
  }
  
  private handleSubmit(e: Event): void {
    e.preventDefault();
    
    // Validate all fields
    const isValid = this.validateAllFields();
    
    if (isValid) {
      // Form is valid, proceed with submission
      this.submitForm();
    } else {
      // Focus first invalid field
      const firstError = this.shadowRoot?.querySelector('sc-input-group[error]');
      const firstInput = firstError?.querySelector('sc-text-input, sc-number-input');
      (firstInput as HTMLElement)?.focus();
    }
  }
  
  private validateAllFields(): boolean {
    // Trigger blur event on all inputs to validate
    const inputs = this.shadowRoot?.querySelectorAll('sc-text-input, sc-number-input, sc-email-input');
    inputs?.forEach(input => {
      input.dispatchEvent(new Event('blur'));
    });
    
    // Check if any errors exist
    return !this.clientNameError && !this.emailError && !this.loanAmountError;
  }
}
```

### 7. Error Message Guidelines

**Message Principles:**
- Be specific about what's wrong
- Provide examples of correct format when applicable
- Use friendly, non-technical language
- Keep messages concise (under 80 characters)

**Standard Message Templates:**

```typescript
// Store messages alongside validators for consistency
const validators = {
  email: (value: string): ValidationState => ({
    isValid: /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(value),
    errorMessage: 'Please enter a valid email address'
  }),
  
  required: (value: string): ValidationState => ({
    isValid: value.trim().length > 0,
    errorMessage: 'This field is required'
  }),
  
  minLength: (value: string, min: number): ValidationState => ({
    isValid: value.length >= min,
    errorMessage: `Minimum ${min} characters required`
  }),
  
  numberRange: (value: number, min: number, max: number): ValidationState => {
    if (value < min) return { isValid: false, errorMessage: `Value must be at least ${min}` };
    if (value > max) return { isValid: false, errorMessage: `Value must not exceed ${max}` };
    return { isValid: true, errorMessage: '' };
  }
};
```

### 8. Validation Example: Complete SC WebKit Form

```html
<form @submit="${this.handleSubmit}">
  <sc-grid-row>
    <!-- Client Name -->
    <sc-grid-column xs="12" md="6" lg="6">
      <sc-input-group
        label="Client Name"
        required
        ?error="${this.clientNameError}"
        error-message="${this.clientNameErrorMsg}"
        help-text="Enter the full legal name">
        <sc-text-input
          max-length="100"
          show-character-count
          @blur="${this.handleClientNameBlur}">
        </sc-text-input>
      </sc-input-group>
    </sc-grid-column>

    <!-- Email -->
    <sc-grid-column xs="12" md="6" lg="6">
      <sc-input-group
        label="Email Address"
        required
        ?error="${this.emailError}"
        error-message="${this.emailErrorMsg}">
        <sc-email-input
          @blur="${this.handleEmailBlur}">
        </sc-email-input>
      </sc-input-group>
    </sc-grid-column>
  </sc-grid-row>

  <sc-grid-row>
    <!-- Phone -->
    <sc-grid-column xs="12" md="6" lg="6">
      <sc-input-group
        label="Phone Number"
        required
        ?error="${this.phoneError}"
        error-message="${this.phoneErrorMsg}"
        help-text="Format: (555) 555-5555">
        <sc-formatted-input
          mask="(000) 000-0000"
          @blur="${this.handlePhoneBlur}">
        </sc-formatted-input>
      </sc-input-group>
    </sc-grid-column>

    <!-- Loan Amount -->
    <sc-grid-column xs="12" md="6" lg="6">
      <sc-input-group
        label="Loan Amount"
        required
        ?error="${this.loanAmountError}"
        error-message="${this.loanAmountErrorMsg}">
        <sc-number-input
          min="1000"
          max="10000000"
          step="1000"
          prefix-icon="currency-dollar"
          @blur="${this.handleLoanAmountBlur}">
        </sc-number-input>
      </sc-input-group>
    </sc-grid-column>
  </sc-grid-row>

  <sc-grid-row>
    <!-- Interest Rate -->
    <sc-grid-column xs="12" md="4" lg="4">
      <sc-input-group
        label="Interest Rate"
        required
        ?error="${this.interestRateError}"
        error-message="${this.interestRateErrorMsg}">
        <sc-number-input
          min="0.1"
          max="25"
          step="0.1"
          suffix-label="%"
          @blur="${this.handleInterestRateBlur}">
        </sc-number-input>
      </sc-input-group>
    </sc-grid-column>

    <!-- Term Length -->
    <sc-grid-column xs="12" md="4" lg="4">
      <sc-input-group
        label="Term Length"
        required
        ?error="${this.termError}"
        error-message="${this.termErrorMsg}">
        <sc-number-input
          min="1"
          max="30"
          step="1"
          suffix-label="years"
          @blur="${this.handleTermBlur}">
        </sc-number-input>
      </sc-input-group>
    </sc-grid-column>

    <!-- Start Date -->
    <sc-grid-column xs="12" md="4" lg="4">
      <sc-input-group
        label="Start Date"
        required
        ?error="${this.startDateError}"
        error-message="${this.startDateErrorMsg}">
        <sc-date-input
          min="2020-01-01"
          max="2030-12-31"
          @blur="${this.handleStartDateBlur}">
        </sc-date-input>
      </sc-input-group>
    </sc-grid-column>
  </sc-grid-row>

  <sc-grid-row>
    <!-- Description -->
    <sc-grid-column xs="12" md="12" lg="12">
      <sc-input-group
        label="Description"
        help-text="Optional description (max 500 characters)">
        <sc-text-input
          multiline
          rows="4"
          max-length="500"
          show-character-count>
        </sc-text-input>
      </sc-input-group>
    </sc-grid-column>
  </sc-grid-row>

  <sc-grid-row>
    <sc-grid-column xs="12" md="12" lg="12">
      <sc-spacer size="md"></sc-spacer>
      <sc-button type="submit" variant="primary">Submit Application</sc-button>
      <sc-button variant="secondary" @click="${this.handleCancel}">Cancel</sc-button>
    </sc-grid-column>
  </sc-grid-row>
</form>
```

## Best Practices

## Best Practices

### 1. Validation Strategy
- Use SC WebKit component validation attributes (`required`, `max-length`, `min`, `max`)
- Implement reactive state properties (`@state()`) for error tracking
- Add custom validation logic for complex business rules
- Provide clear, actionable error messages

### 2. User Experience
- **Validate on blur**, not on every keystroke (avoid distraction)
- **Clear errors** when user starts correcting input
- **Focus first invalid field** on form submission failure
- **Use help-text** to guide users before they make errors
- **Show character count** for fields with length limits

### 3. Accessibility
- Error messages are automatically announced by SC WebKit components
- Ensure `label` attribute is always provided
- Maintain proper tab order for keyboard navigation
- Test with screen readers (VoiceOver, NVDA)

### 4. Performance
- Cache regex patterns outside component (module-level constants)
- Debounce validation for expensive operations (API calls, complex regex)
- Validate only changed fields, not entire form on every blur
- Use native component attributes (`min`, `max`) over custom JavaScript when possible


## Checklist
- [ ] All required fields use `required` attribute on `sc-input-group`
- [ ] Max length constraints applied using `max-length` on `sc-text-input`
- [ ] Reactive `@state()` properties created for error states (e.g., `emailError`, `amountError`)
- [ ] Error messages use reactive properties with `?error="${this.fieldError}"` pattern
- [ ] Validation functions implemented for custom business rules
- [ ] Event handlers added for `@blur` events on input components
- [ ] Number inputs use `min`, `max`, and `step` attributes on `sc-number-input`
- [ ] Email validation uses `sc-email-input` or custom regex pattern
- [ ] Phone formatting uses `sc-formatted-input` with appropriate mask
- [ ] Date inputs use `sc-date-input` with `min`/`max` constraints
- [ ] Character counting enabled with `show-character-count` where needed
- [ ] Help text provided using `help-text` attribute on `sc-input-group`
- [ ] Success states use `success` and `success-message` attributes
- [ ] Form-level validation checks all error states before submission
- [ ] First invalid field receives focus on validation failure
- [ ] Grid layout (`sc-grid-row`/`sc-grid-column`) used for responsive form layout
