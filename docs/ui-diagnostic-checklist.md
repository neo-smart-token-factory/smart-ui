# UI Diagnostic Checklist  
## Smart UI — Read-Only Assessment

**Status:** Mandatory  
**Audience:** Human maintainers, AI assistants  
**Mode:** Diagnostic only (no changes allowed)

---

## 0. Diagnostic Mode Declaration

Before starting, the agent must operate under the following rules:

- No code changes
- No refactors
- No suggestions
- No architectural opinions
- No inferred improvements

The goal is to **describe reality**, not to improve it.

---

## 1. Structural State

Describe the current structure of the `smart-ui` repository.

Checklist:
- [ ] Root folders listed
- [ ] Main entry points identified
- [ ] Build and runtime structure described
- [ ] Frameworks and tooling identified

Output must be descriptive only.

---

## 2. Existing Integrations

Identify all current integrations used by the UI.

Checklist:
- [ ] External APIs called
- [ ] Backend services referenced
- [ ] Wallet or blockchain interactions
- [ ] Environment variables related to integration

Do not assume intent. Report what exists.

---

## 3. Responsibilities Assumed by the UI

Describe what the UI code currently does beyond presentation.

Checklist:
- [ ] State derivation logic
- [ ] Transaction construction
- [ ] Validation or rule enforcement
- [ ] Assumptions about backend behavior

Separate clearly:
- presentation
- coordination
- logic

---

## 4. Boundary Violations (Factual)

Based only on the code, identify whether the UI:

Checklist:
- [ ] Calls backend logic directly
- [ ] Infers protocol state
- [ ] Constructs transactions
- [ ] Implements business rules
- [ ] Encodes lifecycle assumptions

Do not classify as good or bad.  
Only state whether it happens.

---

## 5. Operational Status

Describe the current operational condition.

Checklist:
- [ ] Project builds successfully
- [ ] Runs locally
- [ ] Known runtime errors
- [ ] TODOs or placeholders
- [ ] Incomplete flows

List exact locations when possible.

---

## 6. Documentation Alignment (Deferred)

Do NOT analyze alignment yet.

Only answer:
- [ ] Are there implicit contracts not documented?
- [ ] Are there assumptions without references?

Do not propose fixes.

---

## 7. Stop Condition

When all sections above are completed:

- Stop execution
- Do not implement changes
- Await human instruction

---

## Final Rule

**This checklist measures reality.  
It does not change it.**

Any action beyond description is a violation.
