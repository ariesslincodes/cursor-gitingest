import { apiKeyService } from '@/services/apiKeys';
import { chain } from '@/services/chain';
import { NextResponse } from 'next/server';

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
      console.error(
        'Failed to fetch README:',
        response.status,
        response.statusText
      );
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
    // Validate API key from header
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Invalid or missing API key' },
        { status: 401 }
      );
    }
    const token = authHeader.split(' ')[1];
    const isValidKey = await apiKeyService.validateApiKey(token);

    if (!isValidKey) {
      return NextResponse.json(
        { error: 'Invalid or missing API key' },
        { status: 401 }
      );
    }

    // Parse request body
    let githubUrl: string;
    try {
      const body = await request.json();
      githubUrl = body.githubUrl;

      if (!githubUrl) {
        return NextResponse.json(
          { error: 'githubUrl is required in the request body' },
          { status: 400 }
        );
      }
    } catch {
      return NextResponse.json(
        { error: 'Invalid JSON format in request body' },
        { status: 400 }
      );
    }

    // Parse GitHub URL and fetch data
    let repoInfo;
    try {
      repoInfo = await parseGithubUrl(githubUrl);
    } catch (urlError: unknown) {
      if (urlError instanceof Error) {
        return NextResponse.json(
          { error: 'Invalid GitHub URL', details: urlError.message },
          { status: 400 }
        );
      }
      return NextResponse.json(
        { error: 'Invalid GitHub URL' },
        { status: 400 }
      );
    }

    // Fetch repository data
    const response = await fetch(
      `https://api.github.com/repos/${repoInfo.owner}/${repoInfo.repo}`,
      {
        headers: {
          Accept: 'application/vnd.github.v3+json',
          'User-Agent': 'SuperCur-App',
        },
      }
    );

    if (!response.ok) {
      return NextResponse.json(
        {
          error: 'Failed to fetch repository data',
          details: `Status: ${response.status}, ${response.statusText}`,
        },
        { status: response.status }
      );
    }

    const repoData = await response.json();

    try {
      const summary = await chain(repoData);
      return NextResponse.json(summary);
    } catch (chainError: Error | unknown) {
      if (chainError instanceof Error) {
        if (
          chainError.message?.includes('rate limit') ||
          chainError.message?.includes('quota')
        ) {
          return NextResponse.json(
            {
              error: 'Service temporarily unavailable',
              message:
                'We are experiencing high demand. Please try again in a few minutes.',
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
        message:
          error instanceof Error
            ? error.message
            : 'An unexpected error occurred',
      },
      { status: 500 }
    );
  }
}
