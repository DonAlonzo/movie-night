import decodeToken from "jwt-decode";

const AUTH_HOST = `auth.boman.io`;

let accessToken;

const refreshAccessToken = async () => {
  const response = await fetch(`https://${AUTH_HOST}/api/refresh`, {
    mode: 'cors',
    credentials: 'include'
  });
  ({ accessToken } = await response.json());
}

const isAuthenticated = () => {
  if (!accessToken) return false;
  const { exp } = decodeToken(accessToken);
  if (exp * 1000 < Date.now()) return false;
  return true;
};

export const getAccessToken = async () => {
  if (!isAuthenticated()) await refreshAccessToken();
  return accessToken;
};

export const login = async (username, password) => {
  const response = await fetch(`https://${AUTH_HOST}/api/login`, {
    method: 'POST',
    mode: 'cors',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      username,
      password
    })
  });
  if (response.status !== 200) throw new Error(await response.text());
};

export const logout = async () => {
  const response = await fetch(`https://${AUTH_HOST}/api/logout`, {
    method: 'POST',
    mode: 'cors',
    credentials: 'include'
  });
  if (response.status !== 200) throw new Error(await response.text());
}