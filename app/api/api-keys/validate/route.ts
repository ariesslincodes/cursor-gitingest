import { NextRequest, NextResponse } from 'next/server';
import { apiKeyService } from '@/app/services/apiKeys';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../auth/[...nextauth]/options';

// POST /api/api-keys/validate - Validate an API key
export async function POST(request: NextRequest) {
  // Check authentication for web requests
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { key } = await request.json();
    const validation = await apiKeyService.validateApiKey(key);

    // For authenticated requests, also verify the API key belongs to the user
    if (validation.isValid && validation.userId !== session.user.id) {
      return NextResponse.json({ isValid: false });
    }

    return NextResponse.json({ isValid: validation.isValid });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : 'Failed to validate API key';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
