import { list } from '@vercel/blob';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');

  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return res.status(200).json({});
  }

  try {
    const { blobs } = await list({ prefix: 'birthday-photos/slot-' });
    const photos = {};
    // Sort newest first so latest upload wins per slot
    blobs.sort((a, b) => new Date(b.uploadedAt) - new Date(a.uploadedAt));
    blobs.forEach(blob => {
      const match = blob.pathname.match(/slot-(\d+)/);
      if (match && !photos[match[1]]) {
        photos[match[1]] = blob.url;
      }
    });
    res.status(200).json(photos);
  } catch {
    res.status(200).json({});
  }
}
