import { chain } from '@/app/services/chain';
import { NextResponse } from 'next/server';
import { apiKeyService } from '@/app/services/apiKeys';

export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Invalid or missing API key format' },
        { status: 401 }
      );
    }
    const token = authHeader.split(' ')[1];

    // First validate the API key
    const validationResult = await apiKeyService.validateApiKeyWithUsage(token);
    if (!validationResult.isValid) {
      return NextResponse.json(
        { error: validationResult.error },
        { status: validationResult.status }
      );
    }

    // Then check and increment usage
    const rateLimitResult = await apiKeyService.checkAndIncrementUsage(
      token,
      validationResult.keyData!
    );
    if (!rateLimitResult.allowed) {
      return NextResponse.json(
        { error: rateLimitResult.error },
        { status: rateLimitResult.status }
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
      // Removed the unused parameter completely
      return NextResponse.json(
        { error: 'Invalid JSON format in request body' },
        { status: 400 }
      );
    }

    // Parse GitHub URL and fetch repository data
    try {
      const urlParts = new URL(githubUrl).pathname.split('/').filter(Boolean);
      const [owner, repo] = urlParts;

      if (!owner || !repo) {
        throw new Error(
          'Invalid GitHub URL format: missing owner or repository'
        );
      }

      console.log('Fetching repository data:', { owner, repo });

      // Fetch repository data and README content in parallel
      const [repoResponse, readmeResponse] = await Promise.all([
        fetch(`https://api.github.com/repos/${owner}/${repo}`, {
          headers: {
            Accept: 'application/vnd.github.v3+json',
            'User-Agent': 'SuperCur-App',
          },
        }),
        fetch(`https://api.github.com/repos/${owner}/${repo}/readme`, {
          headers: {
            Accept: 'application/vnd.github.v3.raw',
            'User-Agent': 'SuperCur-App',
          },
        }),
      ]);

      if (!repoResponse.ok) {
        throw new Error(
          `GitHub API error: ${repoResponse.status} ${repoResponse.statusText}`
        );
      }

      if (!readmeResponse.ok) {
        throw new Error('Failed to fetch README');
      }

      const repoData = await repoResponse.json();

      // Generate summary using the chain
      const summary = await chain({
        name: repoData.full_name,
        description: repoData.description || '',
        stargazers_count: repoData.stargazers_count,
        language: repoData.language || 'Not specified',
        topics: repoData.topics || [],
        updated_at: repoData.updated_at,
        html_url: repoData.html_url,
      });

      return NextResponse.json(summary);
    } catch (error) {
      console.error('Error processing request:', {
        error: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
        timestamp: new Date().toISOString(),
      });

      return NextResponse.json(
        {
          error: 'Failed to process GitHub repository',
          details: error instanceof Error ? error.message : 'Unknown error',
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Top-level error:', {
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      timestamp: new Date().toISOString(),
    });

    return NextResponse.json(
      {
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
