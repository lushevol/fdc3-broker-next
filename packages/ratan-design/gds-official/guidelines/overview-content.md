# Standard Chartered UX Copy Guidelines

Follow Standard Chartered's brand principles: **human, dynamic, and direct**.

---

## 1. Capitalisation

- **Use sentence case for all UI elements** (buttons, labels, headings, descriptions)
- Capitalise only the first letter of the first word
- **Capitalise proper nouns:** Geographies, departments, names, product/brand names (e.g., Singapore, Corporate & Investment Banking, Straight2Bank)
- **Use lowercase for:** Generic titles, places, financial terms, currencies, 'e' terms (e.g., email, e-commerce)
- **Never use Title Case or ALL CAPS**

---

## 2. Dates, Times and Numbers

### Dates

- Format: **day month year** (e.g., 3 Nov 2021, Wed, 5 Dec 2024)
- Abbreviate months to 3 letters when space is limited
- Avoid numeric-only dates unless helper text is provided

### Time

- Use 24-hour clock: **HH:MM:SS** (e.g., 16:05:33)
- Use endash for ranges: 17:00–19:00
- Include timezone: UTC+8 or SGT

### Numbers

- **UX copy:** Use figures for all numbers (2, 9, 10, 11)
- **Prose:** Spell out one to nine, use figures for 10+
- Don't use superscript for ordinals (2nd, 10th)
- Use commas for thousands: 1,000,000

---

## 3. Punctuation

- **No full stops** in buttons, labels, modal titles, placeholder text
- **Use full stops** only when body copy contains multiple sentences
- **No exclamation marks**
- **No ampersands** unless part of official names or space is extremely limited
- **No Oxford comma**

---

## 4. Naming

- **Describe, don't brand:** Use functional, descriptive names
- **Keep it short:** 1-3 words (e.g., Customer Information, Case Manager)
- **Focus on action/function:** What does it do?
- **No abbreviations/acronyms** (use Customer Management, not CRM)
- **No redundant words** (use Reports, not Reporting Tool Plugin)
- **Use Title Case for product names only**

---

## 5. Language and Spelling

### Always use UK English

| UK English ✅                   | US English ❌                   |
| ------------------------------- | ------------------------------- |
| colour, centre, organisation    | color, center, organization     |
| authorise, analyse, optimise    | authorize, analyze, optimize    |
| realise, recognise, behaviour   | realize, recognize, behavior    |
| cancelled, travelled            | canceled, traveled              |
| licence (noun), practise (verb) | license (noun), practice (verb) |

**Exceptions:** Product names, technical terms (e.g., JavaScript), quoted content

---

## 6. Voice Principles

### Human

- Warm and approachable, not casual
- Use contractions
- Example: "Get started" not "Sign up now for free!"

### Dynamic

- Accessible to all users
- Avoid complex punctuation
- Example: "We've added new fields to comply with ISO 20022 standards"

### Direct

- Simple, no jargon
- Lead with action, remove filler words
- Example: "Request approved" not "Request approved successfully"
- Example: "You've been logged out due to inactivity. Sign in again?" not "You've not been active on this page. Hence you've been logged out for security purposes"

---

## 7. Best Practices

- **Use active voice:** "Export your form as PDF" not "Your form can now be exported as PDF"
- **Remove unnecessary words:** "successfully", "please", "are you sure you want to"
- **Write concisely:** Pass the "one breath test"
- **Error messages:** Describe the error AND the solution in 1-2 sentences
- **Button labels:** Use verb + object (e.g., Submit form, Delete user)

---

## 8. Standard Patterns

### Modal Patterns

| Pattern             | Header                  | Body                                                                    | Actions                    |
| ------------------- | ----------------------- | ----------------------------------------------------------------------- | -------------------------- |
| **Risky Action**    | Warning                 | [Consequence]. Do you want to proceed?                                  | Cancel \| Proceed          |
| **Discard Changes** | Discard and leave page? | Your edits will not be saved                                            | Stay on page \| Leave page |
| **Cancel Workflow** | Cancel [object]?        | You are cancelling the [object]. [Consequence]. Do you want to proceed? | Keep [object] \| Proceed   |
| **Delete**          | Delete [object]?        | [Cannot be reversed message]                                            | Cancel \| Delete           |
| **Session Timeout** | Session timeout         | You've been logged out due to inactivity. Sign in again?                | Cancel \| Sign in          |

### Action Buttons

| Action                                | Label                        |
| ------------------------------------- | ---------------------------- |
| Submit form/request                   | Submit                       |
| Save temporary work                   | Draft                        |
| Confirm after warning                 | Proceed                      |
| Cancel modal/action                   | Cancel                       |
| Exit without saving                   | Discard                      |
| Stay in current state                 | Keep [object] / Stay on page |
| Remove permanently                    | Delete                       |
| Approve (maker-checker by authoriser) | Authorise                    |
| Reject (maker-checker by authoriser)  | Decline                      |
| Approve (maker only, no checker)      | Approve                      |
| Reject (maker only, no checker)       | Reject                       |

### Error Messages

| Error Type          | Message                         |
| ------------------- | ------------------------------- |
| Empty field         | This field is required          |
| Invalid format      | This is an invalid [field type] |
| Character limit     | Maximum [X] characters          |
| Minimum requirement | Minimum [X] characters required |

### Status Labels

| Status                 | Label                 | Truncated     |
| ---------------------- | --------------------- | ------------- |
| Awaiting authorisation | Pending authorisation | Pending auth. |
| Successfully completed | [Action] completed    | —             |
| In progress            | In progress           | —             |
| Failed                 | Failed                | —             |
| Draft                  | Draft                 | —             |

### Verb Glossary

**When to use which action verb:**

| Verbs                              | Usage                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| ---------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Authorise vs Approve**           | **Authorise** can only be performed by 'authoriser' roles, usually followed by 2FA. Negative action is **Decline**<br>✅ Authorise payment ✅ Decline request<br><br>**Approve** is only used for maker flows with no checker involved. Negative action is **Reject**<br>✅ Approved by Bank ✅ Rejected by Bank                                                                                                                                                                                |
| **Clear vs Reset**                 | **Clear** makes all input fields blank including unchecking of checkboxes and deselecting choices<br>✅ Clear filters ✅ Clear fields<br><br>**Reset** reverts all changes to a form to default value<br>✅ Reset fields ✅ Reset to default                                                                                                                                                                                                                                                    |
| **Create vs Add**                  | **Create** encourages users to start something new from scratch<br>✅ Create article ✅ Create payee<br><br>**Add** allows users to add to an existing collection<br>✅ Add user ✅ Add test case                                                                                                                                                                                                                                                                                               |
| **Delete vs Discard vs Cancel**    | **Delete** destroys an existing object so that it no longer exists. Delete should be followed with a confirmation<br>✅ Delete file<br><br>**Discard** erases unsaved changes and provides a way out. Discard should be followed with a confirmation. This is a clearer verb than Cancel<br>✅ Discard changes<br><br>**Cancel** also erases unsaved changes and provides a way out. Not recommended as it may be confusing when the positive flow is also a cancellation (e.g. Cancel account) |
| **Edit vs Manage**                 | **Edit** allows users to change a field input. If placed next to the editable field there's no need for a noun<br><br>**Manage** allows users to take multiple actions on an input                                                                                                                                                                                                                                                                                                              |
| **Export vs Generate vs Download** | **Export/Generate** initiates transfer and conversion of data to the user's machine. User expects some time will be needed<br>✅ Export CSV ✅ Generate swagger<br><br>**Download** copies data in the same format to the user's machine. Process should be near-instant<br>✅ Download PDF                                                                                                                                                                                                     |
| **Import vs Upload**               | **Import** is used when users transfer data for conversion into another format<br>✅ Import swagger<br><br>**Upload** is used when users copy data of the same format to your platform<br>✅ Upload photo                                                                                                                                                                                                                                                                                       |
| **Save vs Submit vs Done**         | **Save** saves an input immediately to a database. Status of object is typically 'in progress' or 'draft'<br><br>**Submit** indicates submission of input to the next stage i.e. for review or approval<br><br>**Done** applies changes inside a modal or sheet that have not yet been saved. When the modal or sheet closes, users can save or submit all changes they've made                                                                                                                 |

### Key Rules

- **Don't use "successfully"** in confirmation messages
- **Authorise/Decline vs Approve/Reject:**
  - Use **Authorise/Decline** for maker-checker workflows (performed by authoriser roles, usually requires 2FA)
  - Use **Approve/Reject** for maker-only flows with no checker involved
- **Don't use "Discard"** for cancel workflow or delete actions
- **Don't use "Save" or "Save as draft"** (use "Draft" + toast notification)
- **Don't repeat field names** in error messages
- **Don't use system error codes** without context (avoid "Error 400")

---

## Quick Checklist

✅ Sentence case (not Title Case or ALL CAPS)  
✅ UK English spelling  
✅ No full stops in UI labels  
✅ No "successfully", "please"  
✅ Active voice  
✅ Dates: day month year (3 Nov 2021)  
✅ Time: 24-hour format with timezone  
✅ Error messages explain problem + solution  
✅ Use standard patterns for modals and actions
