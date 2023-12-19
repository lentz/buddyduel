export default [
  {
    context: ['/auth', '/logout', '/api'],
    target: 'http://localhost:3000',
    secure: false,
  },
];
