import { FastifyPluginAsync } from 'fastify'

type FastifyEtag = FastifyPluginAsync<fastifyEtag.FastifyEtagOptions>

declare namespace fastifyEtag {
  export interface FastifyEtagOptions {
    algorithm?: 'fnv1a' | string;
    hashFn?: (payload: string) => string
    weak?: boolean;
    replyWith304?: boolean;
  }

  export const fastifyEtag: FastifyEtag
  export { fastifyEtag as default }
  export function fnv1a (payload: string): string
}

declare function fastifyEtag (...params: Parameters<FastifyEtag>): ReturnType<FastifyEtag>
export = fastifyEtag
