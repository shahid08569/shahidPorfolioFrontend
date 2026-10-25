export const environment = {
  production: false,
  apiUrl:
    typeof window !== 'undefined' && (window as any).__API_URL__
      ? (window as any).__API_URL__
      : 'http://localhost:5272/api/v1',
};
