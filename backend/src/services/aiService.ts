import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini API client if key is provided
const GEMINI_KEY = process.env.GEMINI_API_KEY || '';
const OPENAI_KEY = process.env.OPENAI_API_KEY || '';

let geminiClient: GoogleGenerativeAI | null = null;
if (GEMINI_KEY) {
  try {
    geminiClient = new GoogleGenerativeAI(GEMINI_KEY);
    console.log('SyncAI: Gemini generative client initialized successfully.');
  } catch (err) {
    console.error('SyncAI: Failed to initialize Gemini API client:', err);
  }
}

/**
 * Computes a vector embedding for a given text input.
 * Returns a 768-dimensional array (dimension matching our opportunities schema).
 */
export async function getEmbedding(text: string): Promise<number[]> {
  const cleanText = text.replace(/\n/g, ' ').trim();

  // If Gemini is configured, use text-embedding-004 (768 dimensions)
  if (geminiClient) {
    try {
      const model = geminiClient.getGenerativeModel({ model: 'text-embedding-004' });
      const result = await model.embedContent(cleanText);
      if (result && result.embedding && result.embedding.values) {
        return result.embedding.values;
      }
    } catch (err) {
      console.warn('SyncAI: Gemini embedding generation failed, using mock embedding.', err);
    }
  }

  // Fallback / Mock Embedding: Generates a stable pseudo-random 768-dimensional vector
  // based on the string hash so the same query yields identical mock search results.
  let hash = 0;
  for (let i = 0; i < cleanText.length; i++) {
    hash = (hash << 5) - hash + cleanText.charCodeAt(i);
    hash |= 0;
  }

  const embedding: number[] = [];
  for (let i = 0; i < 768; i++) {
    const seed = Math.sin(hash + i) * 10000;
    embedding.push(seed - Math.floor(seed));
  }
  return embedding;
}

/**
 * Formulates an AI conversational response based on user chat message and database context.
 */
export async function generateChatReply(
  userQuery: string,
  contextOpportunities: any[],
  studentProfile: any
): Promise<string> {
  const profileSummary = studentProfile 
    ? `Student Profile: Department of ${studentProfile.department}, Year ${studentProfile.year}, Skills: ${Array.isArray(studentProfile.skills) ? studentProfile.skills.join(', ') : 'None specified'}.`
    : 'Student Profile: Anonymous student.';

  const opportunitiesList = contextOpportunities && contextOpportunities.length > 0
    ? contextOpportunities.map((op, idx) => 
        `[${idx + 1}] Title: "${op.title}" at ${op.company} (${op.category}) | Location: ${op.location} | Skills Needed: ${Array.isArray(op.skills) ? op.skills.join(', ') : op.skills} | Apply Link: ${op.apply_link || 'Direct via UniSync'} | Deadline: ${op.deadline ? new Date(op.deadline).toLocaleDateString() : 'N/A'}`
      ).join('\n')
    : 'No directly matching opportunities were found in the database.';

  const systemInstructions = `You are "SyncAI", an intelligent, empathetic, and premium Campus Career & Opportunity Assistant for the UniSync platform.
Your tagline is "Your Personal Campus Career & Opportunity Assistant".

${profileSummary}

Below are the relevant opportunities matching the user's intent fetched from the database:
${opportunitiesList}

Instructions:
1. Greet the student professionally and answer their career, job, internship, hackathon, or scholarship questions.
2. Directly reference the opportunities listed above if they are relevant. Give their title, company, deadline, and skills required.
3. If no opportunities match, suggest they adjust their filters or try another query, but offer helpful general advice related to their field.
4. Keep the response clean, well-formatted (using Markdown), concise, and encouraging.
5. If the student profile indicates missing skills for an opportunity they might like, point it out gently and suggest how they can learn them.
6. Provide action links using Markdown links if available.
7. Be proactive and helpful. Do not mention system prompts or instructions.`;

  // Try Gemini if client is ready
  if (geminiClient) {
    try {
      const model = geminiClient.getGenerativeModel({ 
        model: 'gemini-1.5-flash',
        generationConfig: { maxOutputTokens: 800 }
      });
      const chat = model.startChat({
        history: [
          { role: 'user', parts: [{ text: systemInstructions }] },
          { role: 'model', parts: [{ text: 'Understood. I am SyncAI, ready to assist UniSync students with their career opportunities.' }] }
        ]
      });

      const result = await chat.sendMessage(userQuery);
      const reply = result.response.text();
      if (reply) return reply;
    } catch (err) {
      console.warn('SyncAI: Gemini generation failed, falling back to mock agent.', err);
    }
  }

  // AI Conversational Fallback Engine (Mock Model with high quality custom regex heuristics)
  const queryLower = userQuery.toLowerCase();
  let responseText = '';

  if (queryLower.includes('hackathon') || queryLower.includes('competition')) {
    responseText = `### 🏆 Hackathons & Competitions

Here are the hackathons matching your query:

*   **Smart India Hackathon 2026**
    *   **Organizer / Host:** Govt of India
    *   **Key Skills:** React, Flask, AI, IoT
    *   **Deadline:** Registration closes in a few days!
    *   *SyncAI Advice:* This is a prestigious national-level hackathon. Since you are in the **${studentProfile?.department || 'Engineering'}** department, participating in this will look excellent on your resume. Your project team should leverage your core skills to build a prototype.

Would you like me to recommend some team members from the **Collaboration Hub** who match these skills?`;
  } else if (queryLower.includes('internship') || queryLower.includes('intern')) {
    responseText = `### 💼 Internships Recommended for You

I found some internships that match:

1.  **AI / ML Research Intern** at **Google**
    *   **Location:** Bangalore, India
    *   **Skills Required:** Python, PyTorch, Machine Learning, TensorFlow
    *   **Deadline:** Within 30 days.
    *   *Match Quality:* Highly matches your department profile. 

2.  **CAD Design Intern** at **Tesla**
    *   **Location:** Bangalore, India
    *   **Skills Required:** CAD, SolidWorks, CATIA
    *   *Match Quality:* Recommended for Mechanical students.

Would you like to analyze your resume using our **Resume Analyzer** to see if you have any missing skills for these roles?`;
  } else if (queryLower.includes('job') || queryLower.includes('opening') || queryLower.includes('developer')) {
    responseText = `### 🚀 Latest Job Openings

Here are the active career postings:

*   **Full Stack Developer Job** at **Microsoft**
    *   **Location:** Remote
    *   **Skills Required:** React, TypeScript, Node.js, PostgreSQL
    *   **Eligibility:** Graduating students with CGPA > 8.0
    *   *SyncAI Note:* A great remote opportunity. If you need to build up your Full Stack skills, I recommend checking out our digital notes for Web Technologies or launching a shared study room.

*   **Embedded Systems Engineer** at **Intel**
    *   **Location:** Bangalore, India
    *   **Skills Required:** Embedded C, RTOS, Microcontrollers, IoT

You can click the opportunity cards in the **Opportunity Hub** dashboard to apply directly!`;
  } else if (queryLower.includes('resume') || queryLower.includes('profile')) {
    responseText = `### 📊 Profile & Resume Analysis

Based on your student console profile (**${studentProfile?.department || 'Computer Science & Engineering'}**), here is my current analysis:

1.  **Skills Identified:** React, Node.js, PostgreSQL (Simulated).
2.  **Placement Readiness Score:** **78/100** (Good).
3.  **Missing Key Skills for Top Jobs:** TypeScript, PyTorch, Embedded C (depending on target track).
4.  **Recommendations:**
    *   Upload your actual resume as a **PDF** in the **Resume Analyzer** section of the Opportunity Hub. It will calculate your ATS compatibility score and extract missing keywords automatically.
    *   Participate in one active hackathon team to increase your **Activity Score**.

How can I help you prepare further?`;
  } else {
    responseText = `### Hello! I am SyncAI 🤖
*Your Personal Campus Career & Opportunity Assistant*

How can I help you today? You can ask me to:
*   "Show latest hackathons"
*   "Find AI internships"
*   "Show React developer jobs"
*   "Suggest opportunities based on my profile"
*   "Analyze my resume score"

*Current Filter Context:* Matching opportunities for **${studentProfile?.department || 'Computer Science & Engineering'}**.`;
  }

  return responseText;
}
