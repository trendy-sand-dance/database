import { FastifyRequest, FastifyReply } from 'fastify';

export async function getHome(request: FastifyRequest, reply: FastifyReply) {
	return reply.send({ message: "home page" });
};
