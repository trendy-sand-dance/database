import { FastifyRequest, FastifyReply } from 'fastify';

export const viewDB = async (request: FastifyRequest, reply: FastifyReply): Promise<any> => {
	try {
		const users = await request.server.prisma.user.findMany();
		reply.send(users);
	} catch (error) {
		reply.status(500).send({ error: 'Failed to fetch users' });
	}
};