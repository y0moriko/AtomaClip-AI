import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

/**
 * Gets the current user from either cookies (web) or Authorization header (extension)
 */
export async function getServerUser(req?: Request) {
  let cookieStore = null;
  try {
    cookieStore = cookies();
  } catch (e) {
    // cookies() might fail in some contexts, though rare in App Router API routes
  }
  
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore ? cookieStore.getAll().map(({ name, value }: any) => ({ name, value })) : []
        },
      },
    }
  );

  // 1. Try Authorization header first (most common for Extension)
  if (req) {
    const authHeader = req.headers.get('Authorization');
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.replace('Bearer ', '');
      const { data: { user }, error } = await supabase.auth.getUser(token);
      if (user && !error) {
        return user;
      }
    }
  }

  // 2. Fallback to cookie-based auth (Web Dashboard)
  if (cookieStore) {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (user && !error) {
      return user;
    }
  }

  return null;
}
