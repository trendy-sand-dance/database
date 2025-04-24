import { FastifyRequest, FastifyReply } from 'fastify';

export const getStats = async (request: FastifyRequest, reply: FastifyReply): Promise<any> => {
	try {
		const { username } = request.params as { username: string };
		const user = await request.server.prisma.user.findUnique({
			where: { username },
			select: {
				// TODO: check whats needed here
				wins: true, 
				losses: true,
			}
		});

	return reply.code(200).send(user);
	} catch (error) {
		reply.status(500).send({ error: 'Failed to fetch user statistics' });
	}
};

