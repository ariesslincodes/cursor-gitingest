import { apiKeyService } from '@/app/services/apiKeys';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    let apiKey: string;

    // Check if it's a JSON request (from web) or API request (from Postman)
    const contentType = request.headers.get('content-type');
    if (contentType?.includes('application/json')) {
      // Web request with JSON body
      try {
        const body = await request.json();
        apiKey = body.apiKey;
      } catch {
        return NextResponse.json(
          { error: 'Invalid JSON format in request body' },
          { status: 400 }
        );
      }
    } else {
      // API request with Authorization header
      const authHeader = request.headers.get('authorization');
      if (!authHeader) {
        return NextResponse.json(
          { error: 'Missing Authorization header' },
          { status: 401 }
        );
      }
      apiKey = authHeader.replace('Bearer ', '');
    }

    if (!apiKey) {
      return NextResponse.json(
        { error: 'API key is required' },
        { status: 400 }
      );
    }

    // Check if the API key exists in your database
    const isValid = await apiKeyService.validateApiKey(apiKey);

    if (isValid) {
      return NextResponse.json({ valid: true });
    } else {
      return NextResponse.json({ error: 'Invalid API key' }, { status: 401 });
    }
  } catch (error) {
    // Only use 500 for actual server errors
    console.error('Server error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
