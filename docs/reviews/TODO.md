# GovPro Assistant Development Tasks

## TO-FIX
_For tracking bugs, regressions, or errors identified during reviews._

- [ ] No items.

## TO-ADD
_For planned new features, enhancements, or capabilities._

- [ ] No items.

## TO-RESEARCH
_For open questions or items requiring further investigation before implementation._

- [ ] No items.

## Integration Points
_For tracking tasks related to system compatibility, API integrations, and deployment dependencies._

- [ ] Develop the SharePoint data connector service layer to enable live queries from the Unified Chat. [Ref: `REQUIREMENTS.md`, FR-4.3.4]
- [ ] Implement the backend or service-layer logic to support the mocked MS Teams notifications for blocked steps and calendar invites. [Ref: `REQUIREMENTS.md`, FR-4.2.8, FR-4.2.11]

## Requirements Traceability
_For mapping development tasks back to specific system requirements (e.g., from REQUIREMENTS.md)._

- [ ] All new features and fixes should include a comment or link in the commit message referencing the corresponding requirement ID (e.g., `FR-4.4.5`) or `TODO.md` task.

## Security Review
_For flagging items that require specific security hardening, review, or compliance checks._

- [ ] Audit all user-input fields (especially in Prompt Templates and Chat) to ensure proper sanitization and prevent XSS vulnerabilities. [Ref: `REQUIREMENTS.md`, NFR-2]
- [ ] Verify that all permission-gated actions (e.g., Role Management) are properly enforced based on the `currentUser.canManageRoles` flag on both the client and (future) server side. [Ref: `REQUIREMENTS.md`, FR-4.4.5]

## Testing & Validation
_For listing tasks related to unit, integration, or system-level testing procedures._

- [ ] Create an end-to-end test to confirm that the AI analysis output changes based on the selected user role and persona. [Ref: `REQUIREMENTS.md`, FR-4.1.2]
- [ ] Write unit tests for the `getDueDateStatus` logic in the Kanban board to verify correct visual indicators (yellow/red borders). [Ref: `REQUIREMENTS.md`, FR-4.2.7]
- [ ] Test the application on the latest versions of Chrome, Firefox, Safari, and Edge to ensure cross-browser compatibility. [Ref: `REQUIREMENTS.md`, NFR-5]
- [ ] Create a validation test to ensure the "Blocked Step" modal correctly displays all tasks and reasons blocking a workflow step. [Ref: `REQUIREMENTS.md`, FR-4.2.10]
