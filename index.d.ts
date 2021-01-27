import { FastifyPlugin } from 'fastify'
import { Server, IncomingMessage, ServerResponse } from 'http';

export interface FastifyEtagOptions {
  algorithm?: 'fnv1a' | string;
  weak?: false | boolean;
}

declare const fastifyEtag: FastifyPlugin<FastifyEtagOptions>

export default fastifyEtag;
