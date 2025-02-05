import { ChatOpenAI } from '@langchain/openai';
import { PromptTemplate } from '@langchain/core/prompts';
import { StructuredOutputParser } from 'langchain/output_parsers';
import { z } from 'zod';

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
