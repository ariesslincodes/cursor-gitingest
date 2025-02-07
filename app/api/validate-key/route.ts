import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/options';
import { createClient } from '@/lib/supabase';

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    // Add more detailed logging for production debugging
    console.log('Validation request received:', {
      hasSession: !!session,
      hasUserId: !!session?.user?.id,
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
    });

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized - No valid session found' },
        { status: 401 }
      );
    }

    const { apiKey } = await request.json();

    // Add API key debug logging
    console.log('API Key validation attempt:', {
      keyLength: apiKey?.length,
      userId: session.user.id,
      timestamp: new Date().toISOString(),
    });

    const supabase = createClient(true);

    // Check if the API key exists and belongs to the user
    const { data, error } = await supabase
      .from('api_keys')
      .select('user_id')
      .eq('key', apiKey)
      .single();

    if (error) {
      console.error('Supabase query error:', {
        error: error.message,
        code: error.code,
        details: error.details,
      });
      return NextResponse.json(
        { error: 'Invalid API key', details: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json({
      isValid: true,
      userId: data.user_id,
    });
  } catch (error) {
    console.error('Validation error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
