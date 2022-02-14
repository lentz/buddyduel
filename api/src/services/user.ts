import axios from 'axios';

async function getToken() {
  const response = await axios.post<any, { data: { access_token: string } }>(
    `https://${process.env.AUTH0_DOMAIN}/oauth/token`,
    {
      grant_type: 'client_credentials',
      client_id: process.env.AUTH0_CLIENT_ID,
      client_secret: process.env.AUTH0_CLIENT_SECRET,
      audience: `https://${process.env.AUTH0_DOMAIN}/api/v2/`,
    },
    {
      headers: { 'content-type': 'application/json' },
    },
  );
  return response.data.access_token;
}

export async function getInfo(userId: string) {
  const response = await axios.get<{ email: string; user_metadata: any }>(
    `https://${process.env.AUTH0_DOMAIN}/api/v2/users/${userId}`,
    {
      headers: { Authorization: `Bearer ${await getToken()}` },
    },
  );
  return response.data;
}

export async function updateMetadata(userId: string, userMetadata: any) {
  const response = await axios.patch(
    `https://${process.env.AUTH0_DOMAIN}/api/v2/users/${userId}`,
    { user_metadata: userMetadata },
    {
      headers: { Authorization: `Bearer ${await getToken()}` },
    },
  );
  return response.data;
}
