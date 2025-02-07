import { chain } from '@/app/services/chain';
import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase';

// Helper function to extract repository info from GitHub URL
// async function parseGithubUrl(url: string) {
//   try {
//     const urlObj = new URL(url);
//     if (!urlObj.hostname.includes('github.com')) {
//       throw new Error('Not a GitHub URL');
//     }

//     // Remove any trailing slashes and split the pathname
//     const parts = urlObj.pathname.replace(/^\/|\/$/g, '').split('/');

//     if (parts.length < 2) {
//       throw new Error('Invalid GitHub URL format: missing owner or repository');
//     }

//     const [owner, repo] = parts;
//     console.log('Parsed GitHub URL:', { owner, repo }); // Add logging

//     // Fetch README content from GitHub API
//     const readmeUrl = `https://api.github.com/repos/${owner}/${repo}/readme`;
//     const response = await fetch(readmeUrl);

//     if (!response.ok) {
//       console.error(
//         'Failed to fetch README:',
//         response.status,
//         response.statusText
//       );
//       throw new Error('Failed to fetch README');
//     }

//     const data = await response.json();
//     const readmeContent = Buffer.from(data.content, 'base64').toString('utf-8');

//     return { owner, repo, readmeContent };
//   } catch (error) {
//     console.error('GitHub URL parsing error:', error);
//     throw new Error('Invalid GitHub URL format');
//   }
// }

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

    // Use server-side validation directly
    const supabase = createClient(true);

    // Check if the API key exists and is valid
    const { data: keyData, error: keyError } = await supabase
      .from('api_keys')
      .select('user_id') // Remove active field since it doesn't exist
      .eq('key', token)
      .single();

    if (keyError || !keyData) {
      console.error('API key validation failed:', {
        error: keyError?.message || 'Invalid key',
        timestamp: new Date().toISOString(),
      });

      return NextResponse.json({ error: 'Invalid API key' }, { status: 401 });
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

      // Fetch repository data
      const repoResponse = await fetch(
        `https://api.github.com/repos/${owner}/${repo}`,
        {
          headers: {
            Accept: 'application/vnd.github.v3+json',
            'User-Agent': 'SuperCur-App',
          },
        }
      );

      if (!repoResponse.ok) {
        throw new Error(
          `GitHub API error: ${repoResponse.status} ${repoResponse.statusText}`
        );
      }

      const repoData = await repoResponse.json();

      // Fetch README content
      const readmeResponse = await fetch(
        `https://api.github.com/repos/${owner}/${repo}/readme`,
        {
          headers: {
            Accept: 'application/vnd.github.v3.raw',
            'User-Agent': 'SuperCur-App',
          },
        }
      );

      if (!readmeResponse.ok) {
        throw new Error('Failed to fetch README');
      }

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
