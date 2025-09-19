// FILE: scripts/update-docs.mjs
import { GoogleGenAI } from '@google/genai';
import { promises as fs } from 'fs';
import path from 'path';

const MODEL_NAME = 'gemini-2.5-flash';

// Helper function to recursively list all files in a directory
async function listFiles(dir) {
  const dirents = await fs.readdir(dir, { withFileTypes: true });
  const files = await Promise.all(dirents.map((dirent) => {
    const res = path.resolve(dir, dirent.name);
    return dirent.isDirectory() ? listFiles(res) : res;
  }));
  return files.flat();
}

// Main function to update documentation
async function updateDocumentation() {
  console.log('Starting documentation update process...');

  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

  // 1. Read all relevant source and documentation files
  const srcFiles = await listFiles('src');
  const docFiles = await listFiles('docs');
  const allFiles = [...srcFiles, ...docFiles].filter(
    file => !file.endsWith('.md') && !file.includes('node_modules')
  );

  let combinedContent = '';
  for (const file of allFiles) {
    const content = await fs.readFile(file, 'utf-8');
    combinedContent += `--- FILE: ${path.relative(process.cwd(), file)} ---\n${content}\n\n`;
  }
  
  const todoFilePath = 'docs/reviews/TODO.md';
  let todoFileContent = await fs.readFile(todoFilePath, 'utf-8');

  // 2. Generate a list of TODO tasks based on the codebase
  const todoPrompt = `
    Based on the entire codebase provided, and the existing TODO.md file, generate a list of actionable development tasks.
    Categorize them under the existing sections: TO-FIX, TO-ADD, TO-RESEARCH, Integration Points, Requirements Traceability, Security Review, and Testing & Validation.
    Do not repeat tasks that are already present and checked off in the existing TODO.md.
    Format the output as a simple markdown list of unchecked tasks. Do not include headers or any other formatting.

    EXISTING TODO.md:
    ${todoFileContent}

    CODEBASE:
    ${combinedContent}
  `;

  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: todoPrompt,
      config: {
        systemInstruction: "You are a senior software engineer creating a TODO list for a project.",
      },
    });

    let newTasksContent = response.text.trim();
    
    // 3. Parse the AI response and update the TODO.md file section by section
    const sections = ['TO-FIX', 'TO-ADD', 'TO-RESEARCH', 'Integration Points', 'Requirements Traceability', 'Security Review', 'Testing & Validation'];
    
    // Create a temporary mutable copy of the AI-generated content
    let tempNewContent = newTasksContent;

    sections.forEach(section => {
      // Regex to find the section header and capture all content until the next header or end of file
      const sectionRegex = new RegExp(`(## ${section}\\n_.*?_\\n\\n)([\\s\\S]*?)(?=\\n##|$)`);
      
      // Find the first task in the remaining AI content
      const firstTaskMatch = tempNewContent.match(/^- \[ \].*?\n/);
      
      if (firstTaskMatch) {
        let tasksForSection = '';
        // Consume lines that start with '- [ ]' until we hit a line that doesn't
        while (tempNewContent.trim().startsWith('- [ ]')) {
            const taskMatch = tempNewContent.match(/^- \[ \].*?\n/);
            if (!taskMatch) break;
            const task = taskMatch[0];
            tasksForSection += task;
            // Remove the consumed task from the temporary content
            tempNewContent = tempNewContent.substring(taskMatch.index + task.length);
        }

        if (tasksForSection) {
             // Replace the content of the section with the newly generated tasks
             todoFileContent = todoFileContent.replace(sectionRegex, `$1${tasksForSection.trim()}\n\n`);
        }
      }
    });

    await fs.writeFile(todoFilePath, todoFileContent);
    console.log(`${todoFilePath} updated successfully.`);


    // 4. Update the main user guide
    const userGuidePrompt = `
      Based on the entire codebase, generate a comprehensive, user-friendly "USERS_GUIDE.md".
      The guide should be written in clear, simple language, targeting non-technical users.
      It must cover all major features visible in the UI, explaining how to use them step-by-step.
      Reference the REQUIREMENTS.md to ensure all key functionalities are documented.
      Structure the guide logically with clear headings and sections.
      Output only the complete, final markdown content for the file. Do not include any introductory text like "Here is the guide".

      CODEBASE:
      ${combinedContent}
    `;
    
    const userGuideResponse = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: userGuidePrompt,
    });
    
    await fs.writeFile('docs/users_guide/USERS_GUIDE.md', userGuideResponse.text.trim());
    console.log('USERS_GUIDE.md updated successfully.');

  } catch (error) {
    console.error('Error during AI documentation generation:', error);
    process.exit(1);
  }
}

updateDocumentation();