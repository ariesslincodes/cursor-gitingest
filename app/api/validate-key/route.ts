import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/options';
import { createClient } from '@/lib/supabase';

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    // Add detailed session debugging
    console.log('Session debug:', {
      exists: !!session,
      userId: session?.user?.id,
      email: session?.user?.email,
      status: session ? 'active' : 'missing',
    });

    if (!session?.user?.id) {
      console.log('Authentication failed:', {
        reason: !session ? 'No session' : 'No user ID in session',
        sessionData: session
          ? 'Session exists but incomplete'
          : 'No session data',
      });

      return NextResponse.json(
        { error: 'Unauthorized - No valid session found' },
        { status: 401 }
      );
    }

    const { apiKey } = await request.json();
    console.log('Received API key validation request:', {
      userId: session.user.id,
      keyLength: apiKey?.length,
      hasKey: !!apiKey,
    });

    const supabase = createClient(true);

    // Check if the API key exists and belongs to the user
    const { data, error } = await supabase
      .from('api_keys')
      .select('user_id')
      .eq('key', apiKey)
      .single();

    if (error) {
      console.log('Supabase query error:', {
        error: error.message,
        code: error.code,
        details: error.details,
      });
    }

    if (error || !data) {
      return NextResponse.json(
        { error: 'Invalid API key', details: error?.message },
        { status: 400 }
      );
    }

    console.log('API key validation successful:', {
      foundUserId: data.user_id,
      matchesSession: data.user_id === session.user.id,
    });

    // Return validation result
    return NextResponse.json({
      isValid: true,
      userId: data.user_id,
    });
  } catch (error) {
    console.error('Error validating API key:', {
      error: error instanceof Error ? error.message : 'Unknown error',
      type: error instanceof Error ? error.constructor.name : typeof error,
      stack: error instanceof Error ? error.stack : 'No stack trace',
    });

    return NextResponse.json(
      {
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
