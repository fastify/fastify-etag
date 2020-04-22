import { Plugin } from 'fastify';
import { Server, IncomingMessage, ServerResponse } from 'http';

interface FastifyEtagOptions {
  algorithm?: 'fnv1a' | string;
}

declare const fastifyEtag: Plugin<
  Server,
  IncomingMessage,
  ServerResponse,
  FastifyEtagOptions
>;

export = fastifyEtag;
