let token: string | null = null;

export function setAuthToken(t: string | null) {
  token = t;
}

export function getAuthToken() {
  return token;
}
