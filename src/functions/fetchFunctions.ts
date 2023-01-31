import fetch from 'node-fetch';

import type { UserAuth } from '../typings/authTypes';
import { APITokenObject, APIEndpointRoute } from '../typings/apiTypes';

export const fetchToken = async (
  auth: UserAuth
): Promise<APITokenObject | null> => {
  try {
    const req = await fetch(`${auth.apiEndpoint}/api/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `client_id=ANDR&grant_type=password&username=${auth.userName}&password=${auth.password}`,
    });

    const data = await req.json();
    if (data.error) return null;
    return data;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const fetchFromAPI = async (
  auth: UserAuth,
  token: APITokenObject['access_token'],
  endpointUrl: APIEndpointRoute
) => {
  try {
    const req = await fetch(`${auth.apiEndpoint}/api/3${endpointUrl}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await req.json();
    if (data.error) return null;
    return data;
  } catch (error) {
    console.log(error);
    return null;
  }
};
