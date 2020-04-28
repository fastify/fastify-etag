import fastify from "fastify";
import fastifyEtag, { FastifyEtagOptions } from "../../";

const app = fastify();

app.register(fastifyEtag);

const emptyOpts: FastifyEtagOptions = {}
app.register(fastifyEtag, emptyOpts);

const fnv1aOpts: FastifyEtagOptions = { algorithm: "fnv1a" }
app.register(fastifyEtag, fnv1aOpts);

const stringOpts: FastifyEtagOptions = { algorithm: "sha256" }
app.register(fastifyEtag, stringOpts);
