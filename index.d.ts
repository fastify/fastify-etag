import { Plugin } from 'fastify';
import { Server, IncomingMessage, ServerResponse } from 'http';

const fastifyEtag: Plugin<
  Server,
  IncomingMessage,
  ServerResponse,
  fastifyEtag.FastifyEtagOptions
>;

namespace fastifyEtag {
  interface FastifyEtagOptions {
    algorithm: string;
  }
}

export = fastifyEtag;
