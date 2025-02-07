import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../auth/[...nextauth]/options';
import { createClient } from '@/lib/supabase';

// POST /api/api-keys/validate - Validate an API key
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized', isValid: false },
        { status: 401 }
      );
    }

    const { key } = await request.json();

    if (!key || typeof key !== 'string' || key.length < 32) {
      return NextResponse.json(
        { error: 'Invalid API key format', isValid: false },
        { status: 400 }
      );
    }

    const supabase = createClient(true);

    const { data, error } = await supabase
      .from('api_keys')
      .select('user_id')
      .eq('key', key)
      .single();

    if (error || !data) {
      return NextResponse.json(
        { error: 'Invalid API key', isValid: false },
        { status: 400 }
      );
    }

    // Verify the key belongs to the current user
    if (data.user_id !== session.user.id) {
      return NextResponse.json(
        { error: 'API key does not belong to current user', isValid: false },
        { status: 403 }
      );
    }

    return NextResponse.json({
      isValid: true,
      userId: data.user_id,
    });
  } catch (error) {
    console.error('API key validation error:', error);
    return NextResponse.json(
      { error: 'Internal server error', isValid: false },
      { status: 500 }
    );
  }
}
