import { FastifyPlugin } from 'fastify'
import { Server, IncomingMessage, ServerResponse } from 'http';

export interface FastifyEtagOptions {
  algorithm?: 'fnv1a' | string;
}

declare const fastifyEtag: FastifyPlugin<FastifyEtagOptions>

export default fastifyEtag;
