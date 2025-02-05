import { ChatOpenAI } from '@langchain/openai';
import { PromptTemplate } from '@langchain/core/prompts';
import { StructuredOutputParser } from 'langchain/output_parsers';
import { z } from 'zod';
import { HumanMessage } from '@langchain/core/messages';

// Define interface for GitHub repository data
interface GitHubRepoData {
  name: string;
  description: string | null;
  stargazers_count: number;
  language: string | null;
  topics: string[];
  updated_at: string;
  html_url: string;
  [key: string]: unknown; // Allow for additional GitHub API fields
}

// Define the output schema using Zod
const responseSchema = z.object({
  summary: z.string().describe('A concise summary of the repository'),
  cool_facts: z
    .array(z.string())
    .describe('Interesting facts about the repository'),
  repository: z.object({
    name: z.string().describe('The name of the repository'),
    description: z.string().describe('The repository description'),
    stars: z.number().describe('Number of GitHub stars'),
    language: z.string().describe('Primary programming language'),
    topics: z.array(z.string()).describe('Repository topics/tags'),
    lastUpdated: z.string().describe('Last update date'),
    url: z.string().url().describe('Repository URL'),
  }),
});

// Create a parser from the schema
const parser = StructuredOutputParser.fromZodSchema(responseSchema);

// Create the prompt template
const prompt = PromptTemplate.fromTemplate(`
You are a GitHub repository analyzer. Given a repository's data, provide a structured analysis.
Format your response according to these instructions:

{format_instructions}

Repository Data:
{repoData}

Remember to be concise but informative in your summary and highlight truly interesting facts.
`);

export async function createGitHubSummaryChain() {
  const model = new ChatOpenAI({
    modelName: 'gpt-3.5-turbo',
    temperature: 0.7,
  });

  // Create the chain with structured output
  const chain = prompt.pipe(model).pipe(parser);

  return async function (repoData: GitHubRepoData) {
    try {
      const response = await chain.invoke({
        repoData: JSON.stringify(repoData, null, 2),
        format_instructions: parser.getFormatInstructions(),
      });

      return response;
    } catch (error) {
      console.error('Error in GitHub summary chain:', error);
      throw error;
    }
  };
}

interface RepoData {
  name: string;
  description: string;
  stargazers_count: number;
  language: string;
  topics: string[];
  updated_at: string;
  html_url: string;
}

interface SummaryResponse {
  summary: string;
  cool_facts: string[];
  repository: {
    name: string;
    description: string;
    stars: number;
    language: string;
    topics: string[];
    lastUpdated: string;
    url: string;
  };
}

export async function chain(repoData: RepoData): Promise<SummaryResponse> {
  const chatModel = new ChatOpenAI({
    openAIApiKey: process.env.OPENAI_API_KEY,
    modelName: 'gpt-4-turbo-preview',
    temperature: 0.7,
  });

  const prompt = `Analyze this GitHub repository:
Name: ${repoData.name}
Description: ${repoData.description}
Stars: ${repoData.stargazers_count}
Language: ${repoData.language}
Topics: ${repoData.topics.join(', ')}

Provide:
1. A concise summary of what this repository is about
2. 3-5 interesting facts or key features about the project`;

  const response = await chatModel.invoke([new HumanMessage(prompt)]);
  const content = response.content.toString();

  // Split the response into summary and facts
  const [summary, factsSection] = content.split(
    /\n\n(?=(?:Key )?Facts|Features)/i
  );
  const facts = factsSection
    ?.split('\n')
    .filter(
      (line) => line.trim().startsWith('-') || line.trim().startsWith('•')
    )
    .map((fact) => fact.replace(/^[•-]\s*/, ''));

  return {
    summary: summary.trim(),
    cool_facts: facts || [],
    repository: {
      name: repoData.name,
      description: repoData.description,
      stars: repoData.stargazers_count,
      language: repoData.language,
      topics: repoData.topics,
      lastUpdated: repoData.updated_at,
      url: repoData.html_url,
    },
  };
}
