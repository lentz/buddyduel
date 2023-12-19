export default [
  {
    context: ['/auth', '/logout', '/api'],
    target: 'http://api:3000',
    secure: false,
  },
];
