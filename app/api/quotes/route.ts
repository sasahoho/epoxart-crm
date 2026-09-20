import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { getSupabaseAdmin } from '@/lib/supabase';

export const runtime = 'nodejs';

function text(value: FormDataEntryValue | null) {
  return typeof value === 'string' ? value.trim() : '';
}

function escapeHtml(value: string) {
  return value.replace(/[&<>'"]/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[char] || char));
}

function validEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
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
    const consent = text(form.get('consent'));
    const website = text(form.get('website'));
    if (website) return NextResponse.json({ ok: true });

    if (!fullName || !email || !phone || !city || !address || !projectType || !squareFeet || !description || !consent) {
      return NextResponse.json({ error: 'Veuillez remplir tous les champs obligatoires.' }, { status: 400 });
    }
    if (!validEmail(email)) return NextResponse.json({ error: 'Adresse courriel invalide.' }, { status: 400 });
    if (!Number.isFinite(squareFeet) || squareFeet < 1 || squareFeet > 100000) return NextResponse.json({ error: 'Superficie invalide.' }, { status: 400 });

    const supabase = getSupabaseAdmin();
    const photoFiles = form.getAll('photos').filter((item): item is File => item instanceof File && item.size > 0);
    if (photoFiles.length > 5) return NextResponse.json({ error: 'Maximum 5 photos.' }, { status: 400 });
    const totalBytes = photoFiles.reduce((sum, file) => sum + file.size, 0);
    if (totalBytes > 3_800_000) return NextResponse.json({ error: 'Les photos sont trop lourdes. Maximum 3,8 Mo au total.' }, { status: 400 });

    const uploaded: string[] = [];
    const attachments: { filename: string; content: Buffer }[] = [];
    for (const file of photoFiles) {
      if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) return NextResponse.json({ error: 'Format de photo non accepté.' }, { status: 400 });
      const safe = file.name.replace(/[^a-zA-Z0-9._-]/g, '-');
      const path = `${crypto.randomUUID()}/${Date.now()}-${safe}`;
      const bytes = Buffer.from(await file.arrayBuffer());
      const { error } = await supabase.storage.from('quote-photos').upload(path, bytes, { contentType: file.type, upsert: false });
      if (error) throw error;
      uploaded.push(path);
      attachments.push({ filename: safe, content: bytes });
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

    const { data, error: insertError } = await supabase.from('quotes').insert(quote).select('id, created_at').single();
    if (insertError) throw insertError;

    const signedPhotoUrls = await Promise.all(uploaded.map(async (path, i) => {
      const { data: signed } = await supabase.storage.from('quote-photos').createSignedUrl(path, 60 * 60 * 24 * 7);
      return signed?.signedUrl ? { url: signed.signedUrl, name: attachments[i]?.filename || `Photo ${i + 1}` } : null;
    }));

    const apiKey = process.env.RESEND_API_KEY;
    const adminEmail = process.env.ADMIN_EMAIL;
    const from = process.env.RESEND_FROM_EMAIL || "Épox'Art <onboarding@resend.dev>";
    if (apiKey && adminEmail) {
      const resend = new Resend(apiKey);
      const safe = {
        fullName: escapeHtml(fullName), email: escapeHtml(email), phone: escapeHtml(phone), city: escapeHtml(city), address: escapeHtml(address),
        projectType: escapeHtml(projectType), description: escapeHtml(description), condition: escapeHtml(quote.concrete_condition || 'Non précisé'),
        humidity: escapeHtml(quote.humidity || 'Non précisé'), desired: escapeHtml(quote.desired_date || 'Non précisée')
      };
      const photoLinks = signedPhotoUrls.filter(Boolean).map((p, i) => `<li><a href="${p!.url}" style="color:#9b6a24">${escapeHtml(p!.name || `Photo ${i + 1}`)}</a> <span style="color:#777">(lien valide 7 jours)</span></li>`).join('');

      await resend.emails.send({
        from,
        to: adminEmail,
        replyTo: email,
        subject: `Nouvelle soumission Épox'Art — ${fullName} — ${projectType}`,
        attachments: attachments.map((a) => ({ filename: a.filename, content: a.content })),
        html: `<div style="font-family:Arial,sans-serif;line-height:1.6;color:#171717;max-width:720px;margin:auto">
          <div style="background:#0b0c0f;color:#fff;padding:28px;border-radius:16px 16px 0 0"><div style="color:#d5ad68;font-size:12px;letter-spacing:2px;text-transform:uppercase">Épox'Art · Nouvelle demande</div><h1 style="margin:8px 0 0;font-size:28px">${safe.fullName}</h1></div>
          <div style="border:1px solid #ddd;border-top:0;padding:28px;border-radius:0 0 16px 16px">
            <p><strong>Dossier :</strong> ${data.id}<br><strong>Reçu :</strong> ${new Date(data.created_at).toLocaleString('fr-CA', { timeZone: 'America/Toronto' })}</p><hr style="border:0;border-top:1px solid #eee;margin:22px 0">
            <h2 style="font-size:18px">Coordonnées</h2><p><strong>Nom :</strong> ${safe.fullName}<br><strong>Courriel :</strong> <a href="mailto:${safe.email}">${safe.email}</a><br><strong>Téléphone :</strong> <a href="tel:${safe.phone}">${safe.phone}</a><br><strong>Adresse :</strong> ${safe.address}, ${safe.city}</p>
            <h2 style="font-size:18px">Projet</h2><p><strong>Type :</strong> ${safe.projectType}<br><strong>Superficie :</strong> ${squareFeet} pi²<br><strong>Dimensions :</strong> ${quote.length_ft || '—'} × ${quote.width_ft || '—'} pi<br><strong>État du béton :</strong> ${safe.condition}<br><strong>Humidité :</strong> ${safe.humidity}<br><strong>Période souhaitée :</strong> ${safe.desired}</p>
            <h2 style="font-size:18px">Description</h2><p>${safe.description.replace(/\n/g, '<br>')}</p>
            <h2 style="font-size:18px">Photos (${attachments.length})</h2>${photoLinks ? `<ul>${photoLinks}</ul><p style="font-size:12px;color:#777">Les photos sont aussi jointes directement à ce courriel.</p>` : '<p>Aucune photo.</p>'}
          </div></div>`
      });

      await resend.emails.send({
        from,
        to: email,
        replyTo: adminEmail,
        subject: "Épox'Art — Nous avons reçu votre demande",
        html: `<div style="font-family:Arial,sans-serif;line-height:1.65;color:#171717;max-width:620px;margin:auto"><div style="background:#0b0c0f;color:#fff;padding:28px;border-radius:16px"><div style="color:#d5ad68;font-size:12px;letter-spacing:2px;text-transform:uppercase">Épox'Art</div><h1 style="margin:8px 0 10px">Merci ${safe.fullName}</h1><p style="margin:0;color:#d0d0d0">Votre demande de soumission a bien été reçue.</p></div><div style="padding:28px;border:1px solid #ddd;border-top:0;border-radius:0 0 16px 16px"><p>Nous allons analyser les informations et photos transmises pour votre projet <strong>${safe.projectType}</strong> à ${safe.city}.</p><p><strong>Numéro de dossier :</strong> ${data.id}</p><p>Pour ajouter une précision, vous pouvez simplement répondre à ce courriel.</p><p style="margin-top:26px">Épox'Art</p></div></div>`
      });
    }

    return NextResponse.json({ ok: true, id: data.id });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "La demande n'a pas pu être envoyée. Réessayez dans quelques instants." }, { status: 500 });
  }
}
