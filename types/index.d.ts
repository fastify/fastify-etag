import { FastifyPluginAsync } from 'fastify'

type FastifyEtag = FastifyPluginAsync<fastifyEtag.FastifyEtagOptions>

declare namespace fastifyEtag {
  export interface FastifyEtagOptions {
    algorithm?: 'fnv1a' | string;
    weak?: boolean;
  }

  export const fastifyEtag: FastifyEtag
  export { fastifyEtag as default }
}

declare function fastifyEtag(...params: Parameters<FastifyEtag>): ReturnType<FastifyEtag>
export = fastifyEtag
