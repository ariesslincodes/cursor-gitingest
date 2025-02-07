import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../auth/[...nextauth]/options';
import { createClient } from '@/lib/supabase';

// POST /api/api-keys/validate - Validate an API key
export async function POST(request: NextRequest) {
  // Check authentication for web requests
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { key } = await request.json();
    const supabase = createClient(true);

    // Check if the API key exists and belongs to the user
    const { data, error } = await supabase
      .from('api_keys')
      .select('user_id')
      .eq('key', key)
      .single();

    if (error || !data) {
      return NextResponse.json({ isValid: false });
    }

    // Return validation result with user ID for ownership check
    return NextResponse.json({
      isValid: true,
      userId: data.user_id,
    });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : 'Failed to validate API key';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
