// FILE: scripts/update-docs.mjs
import { GoogleGenAI, Type } from '@google/genai';
import * as fs from 'fs/promises';
import * as path from 'path';

const DOCS_PATH = './docs';
const SRC_PATH = './src';
const TODO_PATH = './docs/reviews/TODO.md';
const USERS_GUIDE_PATH = './docs/users_guide/USERS_GUIDE.md';
const API_KEY = process.env.GEMINI_API_KEY;

if (!API_KEY) {
  throw new Error("GEMINI_API_KEY environment variable not set.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

async function listFiles(dir) {
  const dirents = await fs.readdir(dir, { withFileTypes: true });
  const files = await Promise.all(dirents.map((dirent) => {
    const res = path.resolve(dir, dirent.name);
    return dirent.isDirectory() ? listFiles(res) : res;
  }));
  return Array.prototype.concat(...files);
}

async function getFileContent(filePath) {
  try {
    return `--- START OF FILE ${path.relative(process.cwd(), filePath)} ---\n\n${await fs.readFile(filePath, 'utf-8')}`;
  } catch (error) {
    console.error(`Error reading file ${filePath}:`, error);
    return '';
  }
}

async function updateTodoFile() {
  console.log('Starting TODO.md update...');
  const docFiles = await listFiles(DOCS_PATH);
  const relevantDocs = docFiles.filter(file => file.endsWith('.md') && !file.endsWith('TODO.md'));

  const fileContents = await Promise.all(relevantDocs.map(getFileContent));
  const combinedDocs = fileContents.join('\n\n');

  const prompt = `
You are an expert project manager for a complex aerospace and defense software project.
Your task is to meticulously review the provided project documentation and generate a concise, actionable task list in Markdown format for the team's TODO.md file.

Rules:
1.  Create tasks only for the "TO-FIX", "TO-ADD", and "TO-RESEARCH" sections.
2.  Do NOT create tasks for "Integration Points", "Requirements Traceability", "Security Review", or "Testing & Validation". Leave those to be manually curated.
3.  Each task must be a single line in Markdown checklist format (e.g., "- [ ] ...").
4.  Each task MUST include a clear and precise reference to the source file and the functional requirement ID or specific context (e.g., "[Ref: REQUIREMENTS.md, FR-4.2.7]").
5.  If no actionable items are found for a section, output exactly "- [ ] No items." for that section.
6.  Your entire output must be only the markdown content for the tasks, starting with the first "- [ ]". Do not include headers or any other text.

Here is the project documentation:
---
${combinedDocs}
---

Generate the task list now.
`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    
    const newContent = response.text.trim();
    let todoFileContent = await fs.readFile(TODO_PATH, 'utf-8');

    const sections = ['TO-FIX', 'TO-ADD', 'TO-RESEARCH'];
    let tempNewContent = newContent;

    sections.forEach(section => {
      const sectionRegex = new RegExp(`(## ${section}\\n_.*?_\\n\\n)([\\s\\S]*?)(?=\\n##|$)`);
      const match = tempNewContent.match(new RegExp(`- \\[ \\] .*?`)); // Find first task
      if (match) {
        let tasksForSection = '';
        while(tempNewContent.includes('- [ ]')) {
            const taskMatch = tempNewContent.match(/- \[ \].*?\n/);
            if(!taskMatch) break;
            const task = taskMatch[0];
            tasksForSection += task;
            tempNewContent = tempNewContent.substring(task.length);
            if (!tempNewContent.trim().startsWith('- [ ]')) break;
        }
         todoFileContent = todoFileContent.replace(sectionRegex, `$1${tasksForSection.trim()}\n`);
      }
    });

    await fs.writeFile(TODO_PATH, todoFileContent);
    console.log('Successfully updated TODO.md');
  } catch (error) {
    console.error('Error updating TODO.md:', error);
  }
}


async function updateUserGuide() {
    console.log('Starting USERS_GUIDE.md update...');
    const srcFiles = (await listFiles(SRC_PATH)).filter(f => f.endsWith('.tsx') || f.endsWith('.ts'));
    const srcContents = await Promise.all(srcFiles.map(getFileContent));
    const combinedSrc = srcContents.join('\n\n');
    const currentUserGuide = await getFileContent(USERS_GUIDE_PATH);

    const prompt = `
You are an expert technical writer tasked with updating a user guide for a software application.
I will provide you with the complete source code of the application and the current, potentially outdated, user guide.
Your job is to act as a diligent editor. Read the source code to understand the application's true, current functionality. Then, review the existing user guide and rewrite it to be accurate, clear, and comprehensive.

Rules:
1.  Base your new guide ONLY on the provided source code.
2.  Preserve the existing structure and tone of the guide where possible, but correct any inaccuracies.
3.  Ensure all features visible in the code (like multi-project support, role-based analysis, Kanban board features, specific settings, etc.) are clearly explained.
4.  The output must be the complete, final Markdown content for the new USERS_GUIDE.md file. Do not include any other commentary.

--- SOURCE CODE ---
${combinedSrc}

--- CURRENT USER GUIDE ---
${currentUserGuide}
---

Now, provide the complete, updated USERS_GUIDE.md content.
`;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });

        const newGuideContent = response.text.trim();
        await fs.writeFile(USERS_GUIDE_PATH, newGuideContent);
        console.log('Successfully updated USERS_GUIDE.md');
    } catch (error) {
        console.error('Error updating USERS_GUIDE.md:', error);
    }
}


async function main() {
    await Promise.all([
        updateTodoFile(),
        updateUserGuide()
    ]);
}

main();