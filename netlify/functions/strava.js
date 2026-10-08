// Fonction serverless : OAuth Strava + création d'une activité "Musculation".
// Le secret vient des variables d'environnement Netlify, jamais du code front.
const CLIENT_ID = process.env.STRAVA_CLIENT_ID;
const CLIENT_SECRET = process.env.STRAVA_CLIENT_SECRET;
const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'POST,OPTIONS'
};

export async function handler(event) {
  if (event.httpMethod === 'OPTIONS') return { statusCode: 200, headers: CORS, body: '' };
  if (event.httpMethod !== 'POST') return { statusCode: 405, headers: CORS, body: 'POST only' };
  try {
    if (!CLIENT_ID || !CLIENT_SECRET) {
      return { statusCode: 500, headers: CORS, body: JSON.stringify({ error: 'Config manquante : STRAVA_CLIENT_ID / STRAVA_CLIENT_SECRET' }) };
    }
    const b = JSON.parse(event.body || '{}');

    // 1) Échange du code d'autorisation contre des jetons
    if (b.action === 'exchange') {
      const r = await fetch('https://www.strava.com/oauth/token', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ client_id: CLIENT_ID, client_secret: CLIENT_SECRET, code: b.code, grant_type: 'authorization_code' })
      });
      const j = await r.json();
      return {
        statusCode: r.status, headers: CORS, body: JSON.stringify({
          access_token: j.access_token, refresh_token: j.refresh_token, expires_at: j.expires_at,
          athlete: j.athlete ? { firstname: j.athlete.firstname, lastname: j.athlete.lastname } : null,
          error: j.errors || j.message
        })
      };
    }

    // 2) Création d'une activité manuelle (rafraîchit le jeton d'abord)
    if (b.action === 'create') {
      const tr = await fetch('https://www.strava.com/oauth/token', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ client_id: CLIENT_ID, client_secret: CLIENT_SECRET, refresh_token: b.refresh_token, grant_type: 'refresh_token' })
      });
      const tj = await tr.json();
      if (!tj.access_token) return { statusCode: 401, headers: CORS, body: JSON.stringify({ error: 'refresh échoué', detail: tj }) };

      const params = new URLSearchParams();
      params.append('name', b.name || 'Renforcement musculaire');
      // L'API /activities attend 'type' (WeightTraining = Musculation). 'sport_type' est aussi envoyé pour compat.
      params.append('type', 'WeightTraining');
      params.append('sport_type', 'WeightTraining');
      params.append('start_date_local', b.start_date_local || new Date().toISOString());
      params.append('elapsed_time', String(b.elapsed_time || 1800)); // secondes
      if (b.description) params.append('description', b.description);

      const cr = await fetch('https://www.strava.com/api/v3/activities', {
        method: 'POST',
        headers: { Authorization: 'Bearer ' + tj.access_token, 'Content-Type': 'application/x-www-form-urlencoded' },
        body: params.toString()
      });
      let cj;
      try { cj = await cr.json(); } catch (e) { cj = { parse_error: true }; }
      // On renvoie le status réel de Strava + le détail pour diagnostic côté client
      return { statusCode: 200, headers: CORS, body: JSON.stringify({ ok: cr.ok, strava_status: cr.status, activity: cj, refresh_token: tj.refresh_token }) };
    }

    return { statusCode: 400, headers: CORS, body: JSON.stringify({ error: 'action inconnue' }) };
  } catch (e) {
    return { statusCode: 500, headers: CORS, body: JSON.stringify({ error: String(e) }) };
  }
}
