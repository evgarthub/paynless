export default ({ env }) => ({
  auth: {
    secret: env('ADMIN_JWT_SECRET', '25505383b56c4c24ad9a278f075df71f'),
  },
});
