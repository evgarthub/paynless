export default ({ env }) => ({
  connection: {
    client: 'mysql',
    connection: {
      host: env('DATABASE_HOST', 'evgart.dev'),
      port: env.int('DATABASE_PORT', 13006),
      database: env('DATABASE_NAME', 'strapi-paynless'),
      user: env('DATABASE_USERNAME', 'strapi-paynless'),
      password: env('DATABASE_PASSWORD', 'evgart.dev'),
      ssl: env.bool('DATABASE_SSL', false),
    },
  },
});
