import { FastifyRequest, FastifyReply } from 'fastify';

export const dash = async (request: FastifyRequest, reply: FastifyReply): Promise<any> => {
	try {
		const { username } = request.body as { username: string };
		const user = await request.server.prisma.user.findUnique({
			where: { username }
		});

		// double check logged in?

		reply.code(201).send(user);
	} catch (error) {
		reply.status(500).send({ error: 'Failed to load user dashboard' });
	}
};
