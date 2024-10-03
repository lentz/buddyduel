import config from '../config.js';

export const AUTH0_DOMAIN = 'buddyduel.us.auth0.com';

async function getToken() {
  const response = await fetch(`https://${AUTH0_DOMAIN}/oauth/token`, {
    body: JSON.stringify({
      grant_type: 'client_credentials',
      client_id: config.AUTH0_CLIENT_ID,
      client_secret: config.AUTH0_CLIENT_SECRET,
      audience: `https://${AUTH0_DOMAIN}/api/v2/`,
    }),
    headers: { 'content-type': 'application/json' },
    method: 'POST',
  });

  const responseBody = await response.json();

  return responseBody.access_token;
}

export async function getInfo(userId: string) {
  const response = await fetch(
    `https://${AUTH0_DOMAIN}/api/v2/users/${userId}`,
    {
      headers: { Authorization: `Bearer ${await getToken()}` },
    },
  );

  return await response.json();
}

export async function updateMetadata(
  userId: string,
  userMetadata: { reminderEmails: boolean },
) {
  const response = await fetch(
    `https://${AUTH0_DOMAIN}/api/v2/users/${userId}`,
    {
      body: JSON.stringify({ user_metadata: userMetadata }),
      headers: { Authorization: `Bearer ${await getToken()}` },
      method: 'PATCH',
    },
  );

  return await response.json();
}
