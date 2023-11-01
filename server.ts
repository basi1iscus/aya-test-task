import fastify, { FastifyReply, FastifyRequest } from 'fastify';
import { APIController } from './controllers/apiController';

export class APIServer {
  server = fastify();
  controller = new APIController();
  constructor() {
    this.server.get(
      '/api/v1/remuneration',
      async (request: FastifyRequest, reply: FastifyReply) => {
        return reply.send(await this.controller.getRemuneration());
      }
    );
    this.server.post(
      '/api/v1/loaddump',
      async (request: FastifyRequest, reply: FastifyReply) => {
        return reply.send(await this.controller.loadDump());
      }
    );
  }
}
