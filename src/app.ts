import * as path from 'path';
import AutoLoad, {AutoloadPluginOptions} from '@fastify/autoload';
import { FastifyPluginAsync } from 'fastify';
import { fileURLToPath } from 'url'
import cors from '@fastify/cors';
import fastifyMultipart from '@fastify/multipart';

import "dotenv/config"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export type AppOptions = {
  // Place your custom options for app below here.
} & Partial<AutoloadPluginOptions>;


// Pass --options via CLI arguments in command to enable these options.
const options: AppOptions = {
}

const app: FastifyPluginAsync<AppOptions> = async (
    fastify,
    opts
): Promise<void> => {

  // Place here your custom code!

  fastify.register(fastifyMultipart, {
    limits: {
      fileSize: 5 * 1024 * 1024,
      files: 10,
      fields: 100,
    }
  });

  //void fastify.register(fastifyFormbody, { parser: (str) => parse(str) });

  // void fastify.register(FastifyFormidable, {
  //   formidable: {
  //     maxFileSize: 4 * 1024 * 1024, // 5MB
  //     multiples: true,
  //     keepExtensions: true,
  //   }
  // })

  // Do not touch the following lines

  // This loads all plugins defined in plugins
  // those should be support plugins that are reused
  // through your application
  // void fastify.register(AutoLoad, {
  //   dir: path.join(__dirname, 'plugins'),
  //   options: opts,
  //   forceESM: true
  // })

  // This loads all plugins defined in routes
  // define your routes in one of these
  void fastify.register(AutoLoad, {
    dir: path.join(__dirname, 'routes'),
    options: {
      ...opts,
    },
    forceESM: true,
  })
  
  void fastify.register(cors, {
    origin: "*"
  })

};

export default app;
export { app, options }
