import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase';
import { getToken } from 'next-auth/jwt';

// GET /api/api-keys - List all API keys for authenticated user
export async function GET(req: NextRequest) {
  try {
    const token = await getToken({ req });

    if (!token?.sub) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const supabase = createClient(true);

    const { data: apiKeys, error: supabaseError } = await supabase
      .from('api_keys')
      .select('*')
      .eq('user_id', token.sub)
      .order('created_at', { ascending: false });

    if (supabaseError) {
      throw supabaseError;
    }

    return NextResponse.json(apiKeys);
  } catch {
    return NextResponse.json(
      { error: 'Failed to fetch API keys' },
      { status: 500 }
    );
  }
}

// POST /api/api-keys - Create a new API key
export async function POST(request: NextRequest) {
  try {
    const token = await getToken({ req: request });

    if (!token?.sub) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { name } = await request.json();
    const key = `sk_${crypto.randomUUID()}`;
    const supabase = createClient(true);

    const { error: supabaseError } = await supabase
      .from('api_keys')
      .insert([
        {
          key,
          name,
          usage: 0,
          monthly_limit: 20,
          user_id: token.sub,
        },
      ])
      .select()
      .single();

    if (supabaseError) {
      throw supabaseError;
    }

    return NextResponse.json({ key });
  } catch {
    return NextResponse.json(
      { error: 'Failed to create API key' },
      { status: 500 }
    );
  }
}
