import { FastifyPluginAsync } from 'fastify'

export interface FastifyEtagOptions {
  algorithm?: 'fnv1a' | string;
  weak?: boolean;
}

declare const fastifyEtag: FastifyPluginAsync<FastifyEtagOptions>

export default fastifyEtag;
