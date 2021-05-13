const Hapi = require('@hapi/hapi');
require('dotenv').config();

const Init = async () => {
  const server = Hapi.server({
    port: process.env.APP_PORT,
    host: process.env.APP_HOST,
  });

  await server.start();
  console.log(`Server Running on ${server.info.uri}`);
};

Init();
