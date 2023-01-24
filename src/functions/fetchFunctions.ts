import fetch from 'node-fetch';

import type { UserAuth, APITokenObject } from '../typings/authTypes';

export const fetchToken = async (auth: UserAuth): Promise<APITokenObject> => {
  const req = await fetch(`${auth.apiEndpoint}/api/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: `client_id=ANDR&grant_type=password&username=${auth.userName}&password=${auth.password}`,
  });
  const data = await req.json();
  return data;
};
