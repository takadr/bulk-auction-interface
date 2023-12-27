module.exports = {
  reactStrictMode: true,
  transpilePackages: ["ui", "lib"],
  env: {
    IRON_SESSION_PASSWORD: process.env.IRON_SESSION_PASSWORD,
    IRON_SESSION_COOKIE_NAME: process.env.IRON_SESSION_COOKIE_NAME,
    AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID,
    AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY,
    AWS_REGION: process.env.AWS_REGION,
    AWS_DYNAMO_TABLE_NAME: process.env.AWS_DYNAMO_TABLE_NAME,
  }
};
