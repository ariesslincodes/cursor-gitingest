import { ChatOpenAI } from '@langchain/openai';
import { PromptTemplate } from '@langchain/core/prompts';
import { StructuredOutputParser } from 'langchain/output_parsers';
import { RunnableSequence } from '@langchain/core/runnables';
import { z } from 'zod';

// Define schema for repository summary
export const repositorySchema = z.object({
  summary: z
    .string()
    .min(1)
    .max(1000)
    .describe('A concise summary of the repository'),
  cool_facts: z
    .array(z.string())
    .min(1)
    .max(10)
    .describe('A list of interesting facts about the repository'),
  repository: z.object({
    name: z.string(),
    description: z.string().nullable(),
    url: z.string().url(),
    stars: z.number(),
    language: z.string().nullable(),
    topics: z.array(z.string()),
    lastUpdated: z.string(),
  }),
});

export type RepositorySummary = z.infer<typeof repositorySchema>;

interface RepoData {
  name: string;
  description: string | null;
  stargazers_count: number;
  language: string | null;
  topics: string[];
  updated_at: string;
  html_url: string;
}

function cleanJsonResponse(text: string): string {
  // Remove markdown code block syntax if present
  const jsonMatch = text.match(/```json\n([\s\S]*)\n```/);
  if (jsonMatch) {
    return jsonMatch[1];
  }
  return text;
}

function parseAIResponse(text: string) {
  try {
    // First try to clean markdown and parse
    const cleanedText = cleanJsonResponse(text);
    const parsed = JSON.parse(cleanedText);
    return {
      summary: parsed.summary,
      cool_facts: parsed.cool_facts || [],
    };
  } catch (error) {
    console.error('First parse attempt failed:', error);

    try {
      // If that fails, try to parse the text directly
      const parsed = JSON.parse(text);
      return {
        summary: parsed.summary,
        cool_facts: parsed.cool_facts || [],
      };
    } catch (error) {
      console.error('Second parse attempt failed:', error);

      // If all parsing fails, return a simplified response
      return {
        summary: text,
        cool_facts: [],
      };
    }
  }
}

export async function createRepositorySummary(
  repoData: RepoData,
  readmeContent: string
) {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error('OpenAI API key is not configured');
  }

  const chatModel = new ChatOpenAI({
    openAIApiKey: process.env.OPENAI_API_KEY,
    modelName: 'gpt-3.5-turbo',
    temperature: 0.7,
    maxRetries: 3,
  });

  try {
    // Create prompt template for repository summary
    const promptTemplate = PromptTemplate.fromTemplate(`
      Please analyze this GitHub repository and provide a JSON response with:
      1. A concise summary of the repository
      2. A list of interesting facts about the project
      
      Repository Information:
      Name: {name}
      Description: {description}
      Stars: {stars}
      Language: {language}
      Topics: {topics}
      Last Updated: {lastUpdated}
      
      README Content:
      {readme_content}
      
      Response should be a valid JSON object with this structure (without markdown):
      {{
        "summary": "A concise description",
        "cool_facts": ["Fact 1", "Fact 2", "..."]
      }}
    `);

    // Create output parser to structure the response
    const outputParser = StructuredOutputParser.fromNamesAndDescriptions({
      summary: 'A concise summary of the repository',
      cool_facts: 'A list of interesting facts about the repository',
    });

    // Create formatting function
    const formatInstructions = outputParser.getFormatInstructions();

    // Create the full prompt with formatting instructions
    const fullPrompt = new PromptTemplate({
      template: 'Instructions: {format_instructions}\n{initial_prompt}',
      inputVariables: ['initial_prompt'],
      partialVariables: { format_instructions: formatInstructions },
    });

    // Create the chain
    const chain = RunnableSequence.from([
      {
        initial_prompt: async () => {
          const res = await promptTemplate.format({
            name: repoData.name,
            description: repoData.description || 'No description provided',
            stars: repoData.stargazers_count,
            language: repoData.language,
            topics: repoData.topics?.join(', ') || 'None',
            lastUpdated: repoData.updated_at,
            readme_content: readmeContent,
          });
          return res;
        },
      },
      fullPrompt,
      chatModel,
      async (response) => {
        const parsed = parseAIResponse(response.content);
        return {
          summary: parsed.summary.replace(/```json|```/g, '').trim(),
          cool_facts: parsed.cool_facts,
        };
      },
    ]);

    // Run the chain with error handling
    const chainResult = await chain.invoke({}).catch((error) => {
      console.error('Chain error:', error);
      throw error;
    });

    return {
      ...chainResult,
      repository: {
        name: repoData.name,
        description: repoData.description,
        url: repoData.html_url,
        stars: repoData.stargazers_count,
        language: repoData.language,
        topics: repoData.topics,
        lastUpdated: repoData.updated_at,
      },
    };
  } catch (error: Error | unknown) {
    if (error instanceof Error) {
      if (error.message?.includes('exceeded your current quota')) {
        throw new Error('API rate limit exceeded. Please try again later.');
      }

      if (error.message?.includes('invalid_api_key')) {
        throw new Error('Invalid API configuration. Please contact support.');
      }
    }
    throw error;
  }
}
