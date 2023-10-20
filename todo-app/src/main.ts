import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

const ngrok = require("@ngrok/ngrok");

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
  const url = await ngrok.connect({ addr: 3000, authtoken: "2VwnB9QwavMqe6m69dDp6CI1ZXG_2Lywou9CkCzVmhYa8j1zY" });
  console.log(`Ingress established at: ${url}/graphql`);
}
bootstrap();