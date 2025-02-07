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
  summary: z
    .string()
    .describe('A concise summary of the repository based on README'),
  cool_facts: z
    .array(
      z.object({
        title: z.string().describe('A short title for the fact'),
        description: z.string().describe('Detailed description of the fact'),
        category: z
          .enum([
            'technical',
            'statistics',
            'community',
            'integration',
            'development',
          ])
          .describe('Category of the fact'),
      })
    )
    .min(3)
    .max(5)
    .describe('List of interesting facts about the repository'),
  metadata: z
    .object({
      name: z.string(),
      description: z.string(),
      stars: z.number(),
      language: z.string(),
      topics: z.array(z.string()),
      lastUpdated: z.string(),
      url: z.string(),
    })
    .describe('Repository metadata'),
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

export async function chain(
  repoData: RepoData
): Promise<z.infer<typeof responseSchema>> {
  const chatModel = new ChatOpenAI({
    openAIApiKey: process.env.OPENAI_API_KEY,
    modelName: 'gpt-4-turbo-preview',
    temperature: 0.7,
  });

  const parser = StructuredOutputParser.fromZodSchema(responseSchema);

  // Fetch README content
  const readmeResponse = await fetch(
    `https://api.github.com/repos/${repoData.name}/readme`,
    {
      headers: {
        Accept: 'application/vnd.github.v3.raw',
        'User-Agent': 'SuperCur-App',
      },
    }
  );

  let readmeContent = '';
  if (readmeResponse.ok) {
    readmeContent = await readmeResponse.text();
  }

  const prompt = PromptTemplate.fromTemplate(`
Analyze this GitHub repository based on its README and metadata.
Provide a structured output following this format:

{format_instructions}

Repository Info:
Name: {name}
Description: {description}
Stars: {stars}
Language: {language}
Topics: {topics}

README Content:
{readme}

Focus on extracting accurate information directly from the README and repository data.
Avoid making assumptions not supported by the source material.
For cool facts, make sure each fact is unique and interesting, with a clear title and detailed description.
`);

  const formattedPrompt = await prompt.format({
    format_instructions: parser.getFormatInstructions(),
    name: repoData.name,
    description: repoData.description,
    stars: repoData.stargazers_count,
    language: repoData.language,
    topics: repoData.topics.join(', '),
    readme: readmeContent,
  });

  const response = await chatModel.invoke([new HumanMessage(formattedPrompt)]);
  // Convert the response content to string before parsing
  const responseText = response.content.toString();
  const parsed = await parser.parse(responseText);

  return {
    ...parsed,
    metadata: {
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

export type CoolFact = {
  title: string;
  description: string;
  category:
    | 'technical'
    | 'statistics'
    | 'community'
    | 'integration'
    | 'development';
};

export type SummaryResponse = z.infer<typeof responseSchema>;
