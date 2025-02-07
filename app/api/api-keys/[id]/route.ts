import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase';
import { getToken } from 'next-auth/jwt';
import { PostgrestError } from '@supabase/supabase-js';

// Middleware to check authentication
async function checkAuth(req: NextRequest) {
  const token = await getToken({ req });
  if (!token?.sub) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  return token.sub;
}

type RouteContext = {
  params: {
    id: string;
  };
};

// PUT /api/api-keys/[id] - Update an API key
export async function PUT(request: NextRequest, { params }: RouteContext) {
  const userId = await checkAuth(request);
  if (userId instanceof NextResponse) return userId;

  try {
    const data = await request.json();
    const supabase = createClient(true);
    const { error } = await supabase
      .from('api_keys')
      .update(data)
      .eq('id', params.id)
      .eq('user_id', userId);

    if (error) {
      throw error;
    }

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    const message =
      error instanceof PostgrestError
        ? error.message
        : 'Failed to update API key';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// DELETE /api/api-keys/[id] - Delete an API key
export async function DELETE(request: NextRequest, { params }: RouteContext) {
  const userId = await checkAuth(request);
  if (userId instanceof NextResponse) return userId;

  try {
    const supabase = createClient(true);
    const { error } = await supabase
      .from('api_keys')
      .delete()
      .eq('id', params.id)
      .eq('user_id', userId);

    if (error) {
      throw error;
    }

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    const message =
      error instanceof PostgrestError
        ? error.message
        : 'Failed to delete API key';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
