import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { getSupabaseAdmin } from '@/lib/supabase';

export const runtime = 'nodejs';

function text(value: FormDataEntryValue | null) {
  return typeof value === 'string' ? value.trim() : '';
}

export async function POST(request: Request) {
  try {
    const form = await request.formData();
    const fullName = text(form.get('full_name'));
    const email = text(form.get('email'));
    const phone = text(form.get('phone'));
    const city = text(form.get('city'));
    const address = text(form.get('address'));
    const projectType = text(form.get('project_type'));
    const squareFeet = Number(text(form.get('square_feet')));
    const description = text(form.get('description'));

    if (!fullName || !email || !phone || !city || !address || !projectType || !squareFeet || !description) {
      return NextResponse.json({ error: 'Veuillez remplir tous les champs obligatoires.' }, { status: 400 });
    }

    const supabase = getSupabaseAdmin();
    const photoFiles = form.getAll('photos').filter((item): item is File => item instanceof File && item.size > 0);
    if (photoFiles.length > 10) return NextResponse.json({ error: 'Maximum 10 photos.' }, { status: 400 });

    const uploaded: string[] = [];
    for (const file of photoFiles) {
      if (file.size > 8 * 1024 * 1024) return NextResponse.json({ error: `La photo ${file.name} dépasse 8 Mo.` }, { status: 400 });
      if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) return NextResponse.json({ error: 'Format de photo non accepté.' }, { status: 400 });
      const safe = file.name.replace(/[^a-zA-Z0-9._-]/g, '-');
      const path = `${crypto.randomUUID()}/${Date.now()}-${safe}`;
      const bytes = Buffer.from(await file.arrayBuffer());
      const { error } = await supabase.storage.from('quote-photos').upload(path, bytes, { contentType: file.type, upsert: false });
      if (error) throw error;
      uploaded.push(path);
    }

    const quote = {
      full_name: fullName,
      email,
      phone,
      city,
      address,
      project_type: projectType,
      square_feet: squareFeet,
      length_ft: Number(text(form.get('length_ft'))) || null,
      width_ft: Number(text(form.get('width_ft'))) || null,
      concrete_condition: text(form.get('concrete_condition')) || null,
      humidity: text(form.get('humidity')) || null,
      desired_date: text(form.get('desired_date')) || null,
      description,
      photo_paths: uploaded,
      status: 'Nouvelle'
    };

    const { data, error: insertError } = await supabase.from('quotes').insert(quote).select('id').single();
    if (insertError) throw insertError;

    const apiKey = process.env.RESEND_API_KEY;
    const adminEmail = process.env.ADMIN_EMAIL;
    if (apiKey && adminEmail) {
      const resend = new Resend(apiKey);
      await resend.emails.send({
        from: process.env.RESEND_FROM_EMAIL || "Épox'Art <onboarding@resend.dev>",
        to: adminEmail,
        replyTo: email,
        subject: `Nouvelle soumission — ${fullName} — ${projectType}`,
        html: `
          <div style="font-family:Arial,sans-serif;line-height:1.6;color:#111;max-width:680px;margin:auto">
            <h1>Nouvelle demande de soumission Épox'Art</h1>
            <p><strong>Numéro de dossier :</strong> ${data.id}</p>
            <hr />
            <p><strong>Client :</strong> ${fullName}</p>
            <p><strong>Courriel :</strong> ${email}</p>
            <p><strong>Téléphone :</strong> ${phone}</p>
            <p><strong>Adresse :</strong> ${address}, ${city}</p>
            <p><strong>Type de projet :</strong> ${projectType}</p>
            <p><strong>Superficie :</strong> ${squareFeet} pi²</p>
            <p><strong>Dimensions :</strong> ${quote.length_ft || '—'} × ${quote.width_ft || '—'} pi</p>
            <p><strong>État du béton :</strong> ${quote.concrete_condition || 'Non précisé'}</p>
            <p><strong>Humidité :</strong> ${quote.humidity || 'Non précisé'}</p>
            <p><strong>Période souhaitée :</strong> ${quote.desired_date || 'Non précisée'}</p>
            <p><strong>Description :</strong><br />${description.replace(/\n/g, '<br />')}</p>
            <p><strong>Photos jointes au dossier :</strong> ${uploaded.length}</p>
            <p>Connecte-toi à ton tableau de bord Épox'Art pour consulter le dossier complet et les photos.</p>
          </div>`
      });
    }

    return NextResponse.json({ ok: true, id: data.id });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "La demande n'a pas pu être envoyée. Réessayez dans quelques instants." }, { status: 500 });
  }
}
