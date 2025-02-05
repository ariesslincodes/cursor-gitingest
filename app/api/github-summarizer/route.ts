import { apiKeyService } from '@/app/services/apiKeys';
import { createRepositorySummary } from '@/app/services/chain';
import { NextResponse } from 'next/server';
import { ChatOpenAI } from "@langchain/openai";
import { PromptTemplate } from "@langchain/core/prompts";
import { StructuredOutputParser } from "langchain/output_parsers";
import { RunnableSequence } from "@langchain/core/runnables";
import { z } from "zod";

// Helper function to validate API key
async function validateApiKey(apiKey: string | null): Promise<boolean> {
  if (!apiKey) return false;
  try {
    const isValid = await apiKeyService.validateApiKey(apiKey);
    console.log('API Key validation result:', isValid);
    return isValid;
  } catch (error) {
    console.error('Error validating API key:', error);
    return false;
  }
}

// Helper function to extract repository info from GitHub URL
async function parseGithubUrl(url: string) {
  try {
    const urlObj = new URL(url);
    if (!urlObj.hostname.includes('github.com')) {
      throw new Error('Not a GitHub URL');
    }

    // Remove any trailing slashes and split the pathname
    const parts = urlObj.pathname.replace(/^\/|\/$/g, '').split('/');
    
    if (parts.length < 2) {
      throw new Error('Invalid GitHub URL format: missing owner or repository');
    }

    const [owner, repo] = parts;
    console.log('Parsed GitHub URL:', { owner, repo }); // Add logging

    // Fetch README content from GitHub API
    const readmeUrl = `https://api.github.com/repos/${owner}/${repo}/readme`;
    const response = await fetch(readmeUrl);
    
    if (!response.ok) {
      console.error('Failed to fetch README:', response.status, response.statusText);
      throw new Error('Failed to fetch README');
    }
    
    const data = await response.json();
    const readmeContent = Buffer.from(data.content, 'base64').toString('utf-8');
    
    return { owner, repo, readmeContent };
  } catch (error) {
    console.error('GitHub URL parsing error:', error);
    throw new Error('Invalid GitHub URL format');
  }
}

export async function POST(request: Request) {
  try {
    // Log all incoming headers for debugging
    const headers = Object.fromEntries(request.headers.entries());
    console.log('Incoming request headers:', headers);

    // Validate API key from header
    const apiKey = request.headers.get('x-api-key');
    console.log('Received API key:', apiKey);
    const isValidKey = await validateApiKey(apiKey);
    console.log('API key validation result:', isValidKey);
    
    if (!isValidKey) {
      return NextResponse.json(
        { error: 'Invalid or missing API key' },
        { status: 401 }
      );
    }

    // Parse request body
    let githubUrl: string;
    let body;
    try {
      body = await request.json();
      console.log('Received request body:', body);
      githubUrl = body.githubUrl;
      
      if (!githubUrl) {
        console.log('Missing githubUrl in request body');
        return NextResponse.json(
          { error: 'githubUrl is required in the request body' },
          { status: 400 }
        );
      }
    } catch (jsonError) {
      console.error('JSON parsing error:', jsonError);
      return NextResponse.json(
        { error: 'Invalid JSON format in request body' },
        { status: 400 }
      );
    }

    // Parse GitHub URL
    let repoInfo;
    try {
      console.log('Attempting to parse GitHub URL:', githubUrl);
      repoInfo = await parseGithubUrl(githubUrl);
      console.log('Successfully parsed repo info:', repoInfo);
    } catch (urlError) {
      console.error('URL parsing error:', urlError);
      return NextResponse.json(
        { error: 'Invalid GitHub URL', details: urlError.message },
        { status: 400 }
      );
    }

    // Fetch repository data from GitHub API
    console.log('Fetching repo data for:', `${repoInfo.owner}/${repoInfo.repo}`);
    const response = await fetch(`https://api.github.com/repos/${repoInfo.owner}/${repoInfo.repo}`, {
      headers: {
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'SuperCur-App'  // Added User-Agent header
      }
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('GitHub API error:', {
        status: response.status,
        statusText: response.statusText,
        data: errorData
      });
      return NextResponse.json(
        { 
          error: 'Failed to fetch repository data',
          details: `Status: ${response.status}, ${response.statusText}`
        },
        { status: response.status }
      );
    }

    const repoData = await response.json();
    console.log('Successfully fetched repo data:', repoData);

    try {
      // Generate summary using the chain service
      const result = await createRepositorySummary(repoData, repoInfo.readmeContent);
      return NextResponse.json(result);
    } catch (chainError: Error | unknown) {
      console.error('Chain service error:', chainError);
      
      if (chainError instanceof Error) {
        // Handle rate limit errors
        if (chainError.message?.includes('rate limit') || chainError.message?.includes('quota')) {
          return NextResponse.json(
            { 
              error: 'Service temporarily unavailable',
              message: 'We are experiencing high demand. Please try again in a few minutes.'
            },
            { status: 429 }
          );
        }
      }
      
      throw chainError;
    }

  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'An unexpected error occurred'
      },
      { status: 500 }
    );
  }
}
