import { apiKeyService } from '@/app/services/apiKeys';
import { NextResponse } from 'next/server';
import { headers } from 'next/headers';

export async function POST(request: Request) {
  try {
    // Get the API key from either the request body or Authorization header
    const headersList = headers();
    let apiKey: string;

    // Check if it's a JSON request (from web) or API request (from Postman)
    const contentType = headersList.get('content-type');
    if (contentType?.includes('application/json')) {
      // Web request with JSON body
      const body = await request.json();
      apiKey = body.apiKey;
    } else {
      // API request with Authorization header
      const authHeader = headersList.get('authorization');
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
      return NextResponse.json(
        { error: 'Invalid API key' },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error('Error validating API key:', error);
    return NextResponse.json(
      { error: 'Failed to validate API key' },
      { status: 500 }
    );
  }
} 