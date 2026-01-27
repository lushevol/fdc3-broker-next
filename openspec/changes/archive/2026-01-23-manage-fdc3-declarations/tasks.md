- [ ] Backend Services Setup
  - [ ] Update `useServices.ts` to include `getIntentList`, `createIntent`, `getContextList`, `createContext`. @frontend
  - [ ] (Backend) Ensure endpoints exist or mock them in frontend service layer. @backend-dependency

- [ ] Metadata Management UI
  - [ ] Implement `IntentMasterList` component (Table + Create Dialog).
  - [ ] Implement `ContextMasterList` component (Table + Create Dialog).
  - [ ] Add Tabs to `FDC3Declaration/index.tsx` to switch between Declarations, Intents, Contexts.

- [ ] Interop Editor Component
  - [ ] Create `InteropEditor` component in `common/`.
  - [ ] Implement `IntentSelector` (Autocomplete from Master List).
  - [ ] Implement `ContextSelector` (Multi-select Chips from Master List).
  - [ ] Implement "Listens For" and "Raises" sections using these selectors.
  - [ ] Add JSON view toggle.

- [ ] Declaration Integration
  - [ ] Update `useTableDetail.ts` or `useController.tsx` to fetch Master Lists on load.
  - [ ] Integrate `InteropEditor` into the Create/Edit Declaration dialog.
  - [ ] Validate payload before saving (ensure selected intents/contexts are valid).

- [ ] Verification
  - [ ] Verify creating a new Intent (e.g., "my.custom.Intent").
  - [ ] Verify creating a new Context (e.g., "my.custom.Context").
  - [ ] Verify mapping an App to "my.custom.Intent" with "my.custom.Context" via InteropEditor.
  - [ ] Verify the saved JSON matches FDC3 spec.
