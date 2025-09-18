# Welcome to GovPro Assistant!

This guide will walk you through the key features of the GovPro Assistant workspace to help you get started with analyzing documents, managing your projects, and collaborating with your team.

## 1. Navigating the Workspace

Your workspace is divided into a few key areas:

*   **Sidebar (Left):** This is your main navigation hub. From here, you can access the **Dashboard**, **Workflows**, **Data Connectors**, and **Settings**.
*   **Header (Top):** This area, the "Mission Control Panel," welcomes you and contains tools like the Project Switcher, the **Current Role** dropdown, and the **Information** icon.
*   **Role Selector (Top Right):** Selecting a role (e.g., "Capture Manager," "Writer") changes the AI's persona. This means the analysis, recommendations, and insights will be tailored to the specific focus of that role. Always ensure you're working under the correct role for your current task!
*   **Information Icon (Top Right):** Click the circled 'i' icon to access this guide and other important project documentation at any time.

---

## 2. Managing Your Projects

The GovPro Assistant is designed to handle multiple proposal efforts at once. Each effort is contained within a **Project**.

*   **Project Switcher (Top Left):** The name of your current project is displayed in the header. Click on it to open a dropdown menu that lists all your projects. Select any project to switch to it instantly.
*   **Creating a New Project:** From the project switcher dropdown, click **"+ Create New Project."** A window will appear asking for a Project Name and which Workflow Template to start with.
*   **Important:** Remember that the Dashboard, Workflow, and Team pages all show information **only for the currently selected project**.

---

## 3. Performing AI Analysis (The Dashboard)

The Dashboard is where you'll interact with the core AI analysis engine for your currently selected project.

### Step-by-Step Guide:

1.  **Upload Documents:** Drag and drop your RFI/RFP files into the upload area, or click to select them from your computer. The tool works best with text-based files like `.txt` and `.md`.
2.  **Choose Analysis Type:** You have two options:
    *   **Standard Analysis:** For a quick, general analysis based on your current role, simply click the main **"Analyze with..."** button. The button's text will tell you which AI provider is currently active.
    *   **Advanced Analysis (Prompt Template Store):** Click **"Open Prompt Template Store"** to perform more specific analyses. Here you can:
        *   Select a single template like a "SWOT Analysis" or "Compliance Check."
        *   **Fuse Prompts:** Select up to three templates to combine them into a single, powerful query. Fill in the requested details for each template to provide more context to the AI.
3.  **Run the Analysis:** Once you've selected your templates (if any), click the **"Analyze with..."** button. You'll see a loading indicator while the AI works.
4.  **Review the Output:** The results will appear on the right side, neatly organized into:
    *   **Summary:** A high-level overview.
    *   **Key Requirements:** A checklist of critical items.
    *   **Risks & Challenges:** Potential roadblocks and concerns.
    *   **Recommendations:** Actionable next steps tailored to your role.

### For Technical Users: The Diagram Generator

If you have the **"Technical Solutions"** role selected, you'll see a **"Diagram Generator"** tab. You can describe a process or system architecture in plain English, and the AI will generate the code for it in MermaidJS syntax, which you can then use in other tools.

---

## 4. Managing Your Workflow (The Workflows Page)

This page helps you and your team stay organized and on track for the active project.

### Creating and Managing Tasks

*   **Adding a Task:** You can add tasks from the Kanban board or by clicking "Add Task" on a team member's card.
*   **Task Name vs. Description:** When creating a task, give it a clear, concise **Task Name** (e.g., "Draft Section L"). Use the larger **Description** field for more detailed instructions.
*   **Setting Due Dates:** Use the "Due Date" field to set a specific deadline. You can also select the appropriate **Timezone** to ensure clarity for distributed teams.
*   **Team Management:** Use the "Assign" button to add members to your project team.

### Understanding Blocked Steps
If a step in your workflow diagram turns **red**, it means it's **Blocked**.
*   **See Why:** Simply click on the red, blocked step. A window will pop up showing you exactly which task is causing the hold-up and the reason provided.
*   **Automatic Notifications:** When you view a blocked step, the system automatically sends a (mocked) notification to the Capture Manager and Strategic Reviewer, ensuring the right people are aware of the roadblock without any extra effort from you.

### Kanban Board View

Switch to the "Kanban" view to see all tasks organized by status: To Do, In Progress, Blocked, and Done.

*   **Deadline Indicators:** Pay attention to the colored border on the left of each task card:
    *   **Yellow Border:** This task is due within the next 48 hours.
    *   **Red Border:** This task is overdue.
*   **Moving Tasks:** If a task is assigned to you, you can drag and drop it between columns to update its status.
*   **Task Details:** Click on any task to view its details. From here you can add comments, edit the due date, reassign it, or use the **"Block This Task"** button if an issue is preventing progress.
*   **Calendar Invites (Mocked):** Inside the task details, you can click "Send Invite to Assignee" or "Send Invite to Team" to simulate sending a calendar event for that task's deadline.

---

## 5. Connecting Your Data & Tools

The Data Connectors page allows you to ground the AI in your team's specific knowledge bases and integrate with other tools. These settings are global and apply to all projects.

### Microsoft Teams Integration (Mocked)

1.  Click **"Configure"** on the Microsoft Teams connector.
2.  Enable the **"Synchronize Kanban board with Microsoft Planner"** option.
3.  Now, when you go to your Kanban board in any project, you will see a banner at the top indicating it's "synchronized." This shows how the application would connect to your external planning tools.

### Unified Chat

Use the checkbox next to a connected source (like SharePoint) to make it "active." The chat panel on the right allows you to ask natural language questions, and the AI will use the knowledge from your **active** data sources to provide contextual answers.

---

## 6. Customizing Your Workspace (The Settings Page)

Here you can tailor the application to your preferences and manage team settings. These settings are global and apply across all your projects.

### AI Provider Selection
*   Go to the **"AI Provider"** card.
*   Use the dropdown menu to select which AI service you want to use for analysis (e.g., Google Gemini, OpenAI).
*   If you have a custom model, select "Custom Endpoint" and enter the URL.
*   The API keys for these services are managed by your administrator.

### Personal Settings
*   **User Profile:** Update your name, title, and email.
*   **Theme:** Switch between a Light and Dark visual theme for the application.

### Admin Settings (For Capture Managers)
If you have the correct permissions, you can also:
*   **Manage Workspace Roles:** Create new roles and define their unique AI personas. This allows you to customize the AI's expertise for your team's specific needs.
*   **Manage Workflow Templates:** Design and save custom workflow templates that your entire team can use for future projects.