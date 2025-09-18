# GovPro Assistant

GovPro Assistant is an AI-powered, collaborative platform designed to streamline capture management and proposal writing for teams responding to government Requests for Information (RFIs) and Requests for Proposal (RFPs). This tool helps business development and proposal teams analyze complex documents, manage project workflows, and ground their strategy in industry best practices through a configurable, role-based interface.

---

## ✨ Key Features

*   **🏢 Multi-Project Workspace:** Manage multiple, independent proposal efforts simultaneously. Each project encapsulates its own files, analysis, team, and workflow, allowing you to seamlessly switch contexts via a simple dropdown.
*   **🧠 Multi-Provider AI Analysis:** Upload RFI/RFP documents for in-depth analysis. The platform supports multiple AI providers (Google Gemini, OpenAI, Azure, etc.) and can be configured with custom endpoints.
*   **🎭 Role-Based AI Personas:** Switch between different roles (e.g., Capture Manager, Writer, Technical Solutions) to tailor the AI's analysis and perspective to your specific focus.
*   **🧩 Advanced Prompt Engineering:** Utilize the Prompt Template Store to run specialized analyses like SWOT or Compliance Checks. Fuse up to three templates for complex, multi-faceted queries.
*   **📊 Collaborative Workflow Management:** Visualize your proposal process with a step-by-step diagram or a Kanban board. Assign tasks with suspense dates, get automatic notifications for blocked steps, and drill down into blocking reasons directly from the workflow view.
*   **🚦 Visual Deadline Tracking:** The Kanban board automatically highlights tasks that are due soon (yellow) or overdue (red), providing at-a-glance prioritization.
*   **🔗 Integrated Data Connectors:** Ground the AI's knowledge by connecting to your team's data sources like SharePoint and Microsoft Teams, enabling a unified chat interface for querying your knowledge base.
*   **📅 Mocked MS Teams Integration:** The application is architected for deep integration with Microsoft Teams, featuring mocked UI for:
    *   Sending calendar invites for tasks to assignees or the entire team.
    *   Synchronizing the Kanban board with a Microsoft Planner instance.
*   **🎨 Customizable Workspace:** Configure the application to fit your team's needs by creating custom roles, designing bespoke workflow templates, and switching between light and dark themes.

---

## 🏛️ Architecture & Tech Stack

GovPro Assistant is architected as a modern, client-centric Single Page Application (SPA). This approach minimizes server-side complexity and delivers a fast, responsive user experience.

*   **Frontend Framework:** **React** with **TypeScript**.
    *   **Why?** React's component-based architecture is ideal for building a complex, maintainable UI. TypeScript adds static typing, which improves code quality, reduces runtime errors, and enhances developer productivity.
*   **Styling:** **Tailwind CSS**.
    *   **Why?** Tailwind's utility-first approach allows for rapid UI development and ensures a consistent design system without writing custom CSS. It's highly efficient for creating responsive and customizable layouts.
*   **AI Integration:** **Abstracted AI Service Layer**.
    *   **Why?** The application features a modular AI service layer (`src/services/ai/`) that abstracts interactions with different AI providers. The default implementation uses the **Google Gemini API** (`@google/genai`), but it can be easily switched to other providers like OpenAI or a custom endpoint via the settings menu. This makes the platform flexible and future-proof.

### Architectural Decisions

1.  **Project-Based State Management:** The application's state is architected around the concept of "Projects." The root `App` component manages an array of `Project` objects and tracks the `activeProjectId`. All data—tasks, files, analysis results, teams—is encapsulated within a project, enabling a clean, multi-tenant user experience managed entirely on the client side.
2.  **Abstracted API Service Layer:** A dedicated service module (`src/services/ai/aiService.ts`) acts as a router, directing AI requests to the appropriate provider's implementation (e.g., `googleGeminiService.ts`). This keeps API logic separate from the UI and makes adding new providers simple.
3.  **Component-Driven Design:** The UI is broken down into small, reusable components (e.g., `Modal`, `KanbanBoard`, `FileUpload`) located in the `src/components` directory. This promotes modularity and code reuse.
4.  **Static In-App Documentation:** Documentation files (`.md`) are stored within the `/docs` directory and are fetched and rendered as formatted HTML by the `Docs` component. This provides a simple yet effective way to deliver user guides and technical information without requiring a separate backend or CMS.

---

## 📁 Project Structure

The codebase is organized to maintain a clear separation of concerns:

```
/
├── public/
├── src/
│   ├── components/      # Reusable React components
│   ├── services/        # Modules for external API calls (AI, etc.)
│   ├── App.tsx          # Main application component and state management
│   ├── constants.ts     # Application-wide constants
│   ├── index.tsx        # Application entry point
│   └── types.ts         # TypeScript type definitions
├── docs/
│   ├── requirements/
│   ├── reviews/
│   └── users_guide/
└── README.md            # This file
```

---

## 🚀 Getting Started

This application is designed to run in a managed environment where API keys for the selected AI providers are securely provisioned.

1.  **API Key:** The application requires the appropriate API key to be available as an environment variable (e.g., `process.env.API_KEY` for Google Gemini).
2.  **Running the App:** The application is served statically and is ready to run in its host environment.

---

## 🤝 Contributing

Contributions are welcome! Please feel free to fork the repository, make your changes, and submit a pull request. For major changes, please open an issue first to discuss what you would like to change.

---

## 📄 License

This project is licensed under the MIT License.