import { NestFactory } from '@nestjs/core';

import helmet from 'helmet';

import { AppModule } from './app.module';

import { Callback, Handler, Context } from 'aws-lambda';
import * as serverlessExpress from 'aws-serverless-express';
import { Server } from 'http';
import * as dotenv from 'dotenv';

dotenv.config();

let server: Server;

const port = process.env.PORT || 4000;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: (req, callback) => callback(null, true),
  });
  app.use(helmet());

  await app.init();
  console.log('serverlessExpress:', serverlessExpress);
  const expressApp = app.getHttpAdapter().getInstance();
  const server = serverlessExpress.createServer(expressApp);
  return server;
}
bootstrap().then(() => {
  console.log('App is running on %s port', port);
});

export const handler: Handler = async (
  event: any,
  context: Context,
  callback: Callback,
) => {
  server = server ?? (await bootstrap());
  const resServer = serverlessExpress.proxy(
    server,
    event,
    context,
    'PROMISE',
  ).promise;
  console.log('resServer:', resServer);
  return resServer;
};
