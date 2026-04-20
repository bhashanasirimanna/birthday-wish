import { put } from '@vercel/blob';

export const config = {
  api: { bodyParser: false },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return res.status(500).json({ error: 'Blob storage not configured' });
  }

  const slot = req.headers['x-slot'] ?? '0';
  const contentType = req.headers['content-type'] || 'image/jpeg';
  const ext = contentType.split('/')[1]?.replace('jpeg', 'jpg') || 'jpg';

  try {
    const blob = await put(`birthday-photos/slot-${slot}.${ext}`, req, {
      access: 'public',
      contentType,
      allowOverwrite: true,
    });
    res.status(200).json({ url: blob.url });
  } catch (err) {
    console.error('Upload error:', err);
    res.status(500).json({ error: 'Upload failed' });
  }
}
