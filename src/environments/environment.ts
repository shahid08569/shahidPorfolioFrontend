export const environment = {
  production: true,
  apiUrl:
    typeof window !== 'undefined'
      ? (window as any).__API_URL__ ||
        (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
          ? 'http://localhost:5272/api/v1'
          : '/api/v1')
      : 'http://localhost:5272/api/v1',
};
