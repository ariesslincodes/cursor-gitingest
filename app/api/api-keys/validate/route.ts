import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../auth/[...nextauth]/options';
import { apiKeyService } from '@/app/services/apiKeys';

// POST /api/api-keys/validate - Validate an API key
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized access' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { key } = body;

    if (!key) {
      return NextResponse.json(
        { error: 'API key is required' },
        { status: 400 }
      );
    }

    const validationResult = await apiKeyService.validateApiKeyWithUsage(key);

    if (!validationResult.isValid) {
      return NextResponse.json(
        { error: validationResult.error || 'Invalid API key' },
        { status: validationResult.status || 401 }
      );
    }

    return NextResponse.json({
      isValid: true,
      usage: validationResult.keyData?.usage,
      limit: validationResult.keyData?.monthly_limit,
    });
  } catch (error) {
    console.error('API key validation error:', error);
    return NextResponse.json(
      { error: 'Failed to validate API key' },
      { status: 500 }
    );
  }
}
