import { FastifyPlugin } from 'fastify';

export interface FastifyEtagOptions {
  algorithm?: 'fnv1a' | string;
}

declare const fastifyEtag: FastifyPlugin<FastifyEtagOptions>;
export default fastifyEtag;
