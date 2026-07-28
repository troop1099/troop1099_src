import { createClientFromRequest } from 'npm:@base44/sdk@0.8.40';

// Same Drive folder that holds the "Troop 1099 Data" spreadsheet
const FOLDER_ID = '1yvJLciaTLBNvx9_IMY5Z6WoGBK3ObGXm';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const body = await req.json();
    const { file_data, mime_type, filename } = body;
    if (!file_data || !mime_type || !filename) {
      return Response.json({ error: 'Missing file_data, mime_type, or filename' }, { status: 400 });
    }

    const { accessToken } = await base44.asServiceRole.connectors.getConnection('googledrive');

    // Decode base64 → bytes
    const byteString = atob(file_data);
    const bytes = new Uint8Array(byteString.length);
    for (let i = 0; i < byteString.length; i++) {
      bytes[i] = byteString.charCodeAt(i);
    }

    // Build multipart/related body for the Drive v3 resumable upload
    const boundary = '-------3141592653589793141592653589';
    const metadata = JSON.stringify({ name: filename, parents: [FOLDER_ID] });
    const part1 = `--${boundary}\r\nContent-Type: application/json; charset=UTF-8\r\n\r\n${metadata}\r\n`;
    const part2 = `--${boundary}\r\nContent-Type: ${mime_type}\r\n\r\n`;
    const part3 = `\r\n--${boundary}--`;

    const encoder = new TextEncoder();
    const p1 = encoder.encode(part1);
    const p2 = encoder.encode(part2);
    const p3 = encoder.encode(part3);
    const bodyBytes = new Uint8Array(p1.length + p2.length + bytes.length + p3.length);
    let offset = 0;
    bodyBytes.set(p1, offset); offset += p1.length;
    bodyBytes.set(p2, offset); offset += p2.length;
    bodyBytes.set(bytes, offset); offset += bytes.length;
    bodyBytes.set(p3, offset);

    const uploadRes = await fetch(
      'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': `multipart/related; boundary=${boundary}`,
        },
        body: bodyBytes,
      }
    );

    if (!uploadRes.ok) {
      const errText = await uploadRes.text();
      return Response.json({ error: 'Drive upload failed', details: errText }, { status: 502 });
    }

    const fileData = await uploadRes.json();
    const fileId = fileData.id;

    // Make the file publicly viewable so it renders in <img> tags
    await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}/permissions`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ role: 'reader', type: 'anyone' }),
    });

    const file_url = `https://drive.google.com/thumbnail?id=${fileId}`;
    return Response.json({ file_url, file_id: fileId });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});