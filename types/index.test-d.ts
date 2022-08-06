import fastify from "fastify"
import fastifyEtag from ".."
import { expectError } from "tsd"

const app = fastify();

app.register(fastifyEtag);

app.register(fastifyEtag, {});
app.register(fastifyEtag, { weak: true });
app.register(fastifyEtag, { weak: false });
app.register(fastifyEtag, { algorithm: "fnv1a" });
app.register(fastifyEtag, { algorithm: "sha256" });

expectError(app.register(fastifyEtag, { weak: 1 }))