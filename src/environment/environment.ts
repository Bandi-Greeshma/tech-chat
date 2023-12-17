export const environment = {
  production: false,
  protocol: 'http',
  host: 'localhost:3000',
  api: {
    auth: {
      register: '/api/v1/auth/register',
      login: '/api/v1/auth/login',
    },
    chat: {
      add: '/api/v1/chat/add',
    },
    user: {
      fetch: '/api/v1/user',
    },
  },
};
