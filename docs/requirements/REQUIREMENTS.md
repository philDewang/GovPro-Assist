# GovPro Assistant: Software Requirements Specification

## 1. Introduction

This document outlines the functional and non-functional requirements for the GovPro Assistant, an AI-powered platform designed to streamline capture management and proposal writing for government RFIs and RFPs. The system provides tools for document analysis, workflow management, and team collaboration, all grounded in industry best practices.

## 2. Project Management

- **FR-2.1: Multi-Project Support:** The system shall allow users to create and manage multiple, independent projects.
- **FR-2.2: Project Creation:** Users shall be able to create a new project by providing a name, an optional description, and selecting an initial workflow template from a modal.
- **FR-2.3: Project Switching:** Users shall be able to switch between active projects using a dropdown selector in the main application header.
- **FR-2.4: Scoped Data:** All project-specific data views, including the Dashboard (files, analysis), Workflow (tasks, team), and Kanban board, must be scoped to the currently active project.

## 3. User Roles & Personas

The system shall support multiple user roles, each with a distinct AI persona to guide analysis and specific permissions within the application.

| Role                  | Description                                                                                             | Key Permissions                                |
| --------------------- | ------------------------------------------------------------------------------------------------------- | ---------------------------------------------- |
| **Capture Manager**   | Focuses on overall strategy, win themes, and resource allocation.                                       | Can manage roles and workflow templates.       |
| **Writer**            | Focuses on compliance, narrative structure, and tone.                                                   | Can create/update tasks.                       |
| **Technical Solutions** | Focuses on technical requirements, feasibility, and architecture.                                       | Access to the Diagram Generator.               |
| **Strategic Reviewer**  | Critically evaluates the proposal against strategic goals and competitive positioning.                  | View-only access to most data, can add comments. |
| **Custom Roles**      | Users with appropriate permissions can define new roles with custom names and AI personas.              | Varies based on configuration.                 |

## 4. Functional Requirements

### 4.1. Dashboard & AI Analysis

-   **FR-4.1.1: Document Upload:** Users shall be able to upload one or more documents (TXT, MD) for analysis via a drag-and-drop interface or a file selection dialog.
-   **FR-4.1.2: Role-Based Analysis:** The AI analysis shall be guided by the "persona" of the user's currently selected role (e.g., Capture Manager, Writer).
-   **FR-4.1.3: Prompt Template Store:** Users shall be able to select pre-defined analysis templates (e.g., SWOT, Compliance Check) to guide the AI.
-   **FR-4.1.4: Prompt Fusion:** Users shall be able to select up to three prompt templates to "fuse" into a single, complex analysis query. The UI must provide fields to fill in any variables within the selected templates.
-   **FR-4.1.5: Analysis Execution:** Users shall be able to initiate the analysis, which will display a clear loading state while processing. The analysis button shall indicate which AI provider is currently active.
-   **FR-4.1.6: Result Display:** The system shall display the AI-generated analysis in a structured format, including:
    -   Summary
    -   Key Requirements
    -   Risks & Challenges
    -   Recommendations
-   **FR-4.1.7: Export Analysis:** Users shall be able to export the analysis results as a plain text file.
-   **FR-4.1.8: Diagram Generator (Role-Gated):** Users in the "Technical Solutions" role shall have access to a Diagram Generator tab.
-   **FR-4.1.9: Diagram Generation:** The Diagram Generator shall accept a natural language prompt and use an AI model to generate diagram code in MermaidJS syntax.

### 4.2. Workflow Management

-   **FR-4.2.1: Workflow Template Selection:** Users shall be able to select from a list of available workflow templates (e.g., "Standard RFI Response", "Complex RFP") to structure their project.
-   **FR-4.2.2: Workflow Visualization:** The active workflow shall be displayed as a visual diagram of steps, with the status of each step (e.g., To Do, In Progress, Complete, Blocked) clearly indicated.
-   **FR-4.2.3: Team Management:** Users shall be able to assign team members to the project.
-   **FR-4.2.4: Kanban Board View:** The system shall provide an alternative Kanban board view for task management.
-   **FR-4.2.5: Task Management:** Users shall be able to:
    -   Create new tasks with a mandatory **Task Name** and an optional **Description**.
    -   Assign tasks to a team member and workflow step.
    -   View tasks organized by status (To Do, In Progress, Blocked, Done).
    -   Update a task's status via drag-and-drop on the Kanban board (if they are the assignee).
    -   View task details, including a history of updates/comments.
    -   Add updates and comments to a task.
    -   Block a task from the task detail modal, providing a mandatory reason for the block.
-   **FR-4.2.6: Task Suspense Dates:** Users shall be able to set an optional due date, time, and timezone when creating or editing a task.
-   **FR-4.2.7: Due Date Visual Indicators:** On the Kanban board, task cards shall have a colored left border to indicate due date status:
    -   **Yellow Border:** The task is due within 48 hours.
    -   **Red Border:** The task's due date has passed.
-   **FR-4.2.8: Mocked Calendar Integration:** From the task detail modal, users shall have a mocked function to "Send Calendar Invite" to the assignee or the entire team. A confirmation message shall be displayed.
-   **FR-4.2.9: Mocked Automatic Calendar Invite:** When a new task with a due date is created, a mocked notification shall appear, indicating a calendar invite has been sent to the assignee.
-   **FR-4.2.10: Blocked Step Inspection:** When a user clicks on a step marked "Blocked" in the workflow diagram, a modal shall appear. This modal must display the list of tasks that are blocking the step and the specific reason provided for each block.
-   **FR-4.2.11: Automatic Block Notification (Mocked):** Upon a user inspecting a blocked step, a mocked notification shall be triggered, simulating an email being sent to key project roles (e.g., Capture Manager, Strategic Reviewer).

### 4.3. Data Connectors & Integrations

-   **FR-4.3.1: Connector Management:** Users shall be able to view a list of available data connectors (e.g., SharePoint, Microsoft Teams).
-   **FR-4.3.2: Connection Configuration:** Users shall be able to connect to and configure settings for each data source.
-   **FR-4.3.3: Active Source Selection:** Users shall be able to toggle connected data sources as "active" for querying.
-   **FR-4.3.4: Unified Chat Interface:** The system shall provide a chat interface where users can ask natural language questions. The chat AI shall use the currently active data sources to ground its responses.
-   **FR-4.3.5: Mocked MS Planner Integration:**
    -   Within the Microsoft Teams connector settings, users shall be able to enable an option to "Synchronize Kanban board with Microsoft Planner."
    -   When enabled, a banner shall be displayed at the top of the Kanban board indicating that it is synchronized.

### 4.4. Settings & Configuration

-   **FR-4.4.1: User Profile:** Users shall be able to view and edit their own profile information (name, title, email).
-   **FR-4.4.2: Theme Customization:** Users shall be able to switch the application's appearance between a "light" and "dark" theme.
-   **FR-4.4.3: AI Provider Selection:** Users shall be able to select the active AI provider from a list (e.g., Google Gemini, OpenAI, Azure, HuggingFace, Custom).
-   **FR-4.4.4: Custom AI Endpoint:** When the "Custom" provider is selected, a field shall appear allowing the user to input a custom API endpoint URL.
-   **FR-4.4.5: Role Management (Permissioned):** Users with `canManageRoles` permission shall be able to create, update, and delete custom workspace roles and their associated AI personas.
-   **FR-4.4.6: Workflow Template Management (Permissioned):** Users with appropriate permissions shall be able to create, update, and delete custom workflow templates. Pre-built templates shall not be editable.

### 4.5. Documentation Viewer

-   **FR-4.5.1: In-App Access:** Users shall be able to access all documentation via an "Information" icon in the application header.
-   **FR-4.5.2: Markdown Rendering:** The documentation viewer shall fetch `.md` files from the `/docs` directory and render them as clean, readable HTML, correctly formatting headings, lists, paragraphs, and code blocks.

## 5. Non-Functional Requirements

-   **NFR-1: Performance:** The user interface must be responsive. Long-running operations, such as AI analysis, must provide immediate feedback and a clear loading state to the user. Component re-renders should be minimized to ensure a smooth experience.
-   **NFR-2: Security:** API keys must be managed through environment variables on the server-side and must not be exposed to the client. The application must enforce role-based access control (RBAC) for sensitive operations like managing roles and templates.
-   **NFR-3: Usability:** The application must be intuitive and easy to navigate. All interactive elements must provide clear visual feedback (e.g., hover states, disabled states).
-   **NFR-4: Accessibility:** The application should follow WCAG 2.1 AA guidelines. This includes providing sufficient color contrast (in both themes), keyboard navigability, and appropriate ARIA attributes for all interactive components.
-   **NFR-5: Browser Compatibility:** The application must function correctly on the latest versions of major web browsers (Chrome, Firefox, Safari, Edge).