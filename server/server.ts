import Fastify, { FastifyInstance } from 'fastify';
import dbConnector from './database/dbConnector';
import routes from './routes/routes';

import pluginCORS from '@fastify/cors';
import path from 'node:path';
import pluginStatic from '@fastify/static';
import pluginFormbody from '@fastify/formbody';
import closeWithGrace from 'close-with-grace';
import fastifyMultipart from '@fastify/multipart';

import { FastifyStaticOptions } from '@fastify/static';

const ADDRESS: string = process.env.LISTEN_ADDRESS ? process.env.LISTEN_ADDRESS : '0.0.0.0';
const PORT: number = process.env.LISTEN_PORT ? parseInt(process.env.LISTEN_PORT, 10) : 3000;

//import fs from 'fs';
//const key =  path.join(path.dirname(__dirname), './server/server.key');
//const cert = path.join(path.dirname(__dirname), './server/server.crt');

const fastify: FastifyInstance = Fastify({
  logger: {
    transport: {
		target: 'pino-pretty',
		options: {
			translateTime: 'HH:MM:ss Z',
			ignore: 'pid,hostname',
			colorize: true,
			}
		},
		level: 'info'
	}
//   https: {
//     key: fs.readFileSync(key),
//     cert: fs.readFileSync(cert),
//   }
});

fastify.register(dbConnector);
fastify.register(pluginFormbody);
fastify.register(fastifyMultipart, {
	limits: { fileSize: 10 * 1024 * 1024 }
});

fastify.register(pluginCORS), {
	origin: true, // Specify domains for production
	methods: ['GET', 'POST', 'PUT', 'DELETE'],
	credentials: true
};

fastify.register(pluginStatic, {
	root: path.join(path.dirname(__dirname), 'uploads'),
  } as FastifyStaticOptions)


fastify.register(routes);

async function startServer() {
  // Delay is the number of milliseconds for the graceful close to finish
  closeWithGrace(
    { delay: 500 },
    async ({ err }) => {
      if (err != null) {
        fastify.log.error(err)
      }

      await fastify.close()
    }
  )

  await fastify.ready();

  try {
    await fastify.listen({ port: PORT, host: ADDRESS });
  }
  catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

startServer();
