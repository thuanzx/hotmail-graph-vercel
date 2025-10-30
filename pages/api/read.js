export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  const { text } = req.body || {};
  const lines = (text || '').split('\n').map(l=>l.trim()).filter(Boolean);
  const tenant = process.env.AZURE_TENANT_ID || 'common';
  const tokenUrl = `https://login.microsoftonline.com/${tenant}/oauth2/v2.0/token`;
  const results = [];

  for (const line of lines) {
    const parts = line.split('|').map(p=>p.trim());
    const email = parts[0] || '';
    const refresh_token = parts[2] || '';
    const client_id = parts[3] || process.env.DEFAULT_CLIENT_ID;
    if (!refresh_token || !client_id) {
      results.push({ email, status: 'missing_refresh_or_client', data: null });
      continue;
    }
    try {
      const params = new URLSearchParams({
        client_id,
        grant_type: 'refresh_token',
        refresh_token
      });
      if (process.env.CLIENT_SECRET) params.append('client_secret', process.env.CLIENT_SECRET);
      const tk = await fetch(tokenUrl, { method: 'POST', body: params });
      const tkj = await tk.json();
      if (!tk.ok || !tkj.access_token) {
        results.push({ email, status: 'token_error', code: tk.status, data: tkj });
        continue;
      }
      const access = tkj.access_token;
      const g = await fetch('https://graph.microsoft.com/v1.0/me/messages?$top=5&$select=subject,from,receivedDateTime,bodyPreview', {
        headers: { Authorization: `Bearer ${access}` }
      });
      const gj = await g.json();
      if (!g.ok) {
        results.push({ email, status: 'graph_error', code: g.status, data: gj });
        continue;
      }
      const msgs = (gj.value || []).map(m => ({
        from: m.from?.emailAddress?.address || m.from?.emailAddress?.name || '',
        time: m.receivedDateTime,
        subject: m.subject,
        preview: m.bodyPreview
      }));
      results.push({ email, status: 'ok', messages: msgs });
    } catch (e) {
      results.push({ email, status: 'exception', message: e.message });
    }
  }

  res.setHeader('Content-Type','application/json');
  res.status(200).send(JSON.stringify({ results }));
}
