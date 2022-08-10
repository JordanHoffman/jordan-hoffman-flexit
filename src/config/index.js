export const API_URL =
  process.env.NODE_ENV === 'production'
    ? 'https://flexit-backend.herokuapp.com/'
    : null;