import * as fastify from "fastify";
import * as fastifyEtag from "../../";

const app = fastify();

app.register(fastifyEtag);
app.register(fastifyEtag, {});
app.register(fastifyEtag, { algorithm: "fnv1a" });
app.register(fastifyEtag, { algorithm: "sha256" });
