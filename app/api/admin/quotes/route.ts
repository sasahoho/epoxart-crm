import { NextResponse } from 'next/server';
import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { getSupabaseAdmin } from '@/lib/supabase';

async function getAuthorizedEmail() {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll(); },
        setAll(items: Array<{ name: string; value: string; options: CookieOptions }>) {
          items.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
        }
      }
    }
  );
  const { data: { user } } = await supabase.auth.getUser();
  const allowed = (process.env.ADMIN_EMAIL || '').toLowerCase();
  return user?.email?.toLowerCase() === allowed ? user.email : null;
}

export async function GET() {
  if (!await getAuthorizedEmail()) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase.from('quotes').select('*').order('created_at', { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  const quotes = await Promise.all((data || []).map(async (quote) => {
    const photoUrls = await Promise.all((quote.photo_paths || []).map(async (path: string) => {
      const { data } = await supabase.storage.from('quote-photos').createSignedUrl(path, 3600);
      return data?.signedUrl;
    }));
    return { ...quote, photo_urls: photoUrls.filter(Boolean) };
  }));
  return NextResponse.json({ quotes });
}

export async function PATCH(request: Request) {
  if (!await getAuthorizedEmail()) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
  const body = await request.json();
  const { id, status, notes } = body;
  if (!id) return NextResponse.json({ error: 'ID manquant' }, { status: 400 });
  const changes: Record<string, string | null> = {};
  if (typeof status === 'string') changes.status = status;
  if (typeof notes === 'string' || notes === null) changes.notes = notes;
  const supabase = getSupabaseAdmin();
  const { error } = await supabase.from('quotes').update(changes).eq('id', id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
