import { apiKeyService } from '@/app/services/apiKeys';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { apiKey } = await request.json();
    
    // Check if the API key exists in your database
    const isValid = await apiKeyService.validateApiKey(apiKey);
    
    if (isValid) {
      return NextResponse.json({ valid: true });
    } else {
      return NextResponse.json({ valid: false }, { status: 401 });
    }
  } catch (error) {
    console.error('Error validating API key:', error);
    return NextResponse.json({ error: 'Invalid API key' }, { status: 401 });
  }
} 