import { FastifyRequest, FastifyReply } from 'fastify';

export const wins = async (request: FastifyRequest, reply: FastifyReply): Promise<any> => {
	
	try {
		const { username } = request.params as { username: string };
		
		const user = await request.server.prisma.user.findUnique({
			where: { username }
		});

		return reply.code(200).send(user.wins);
	} catch (error) {
		console.error(error);
		return reply.code(500).send({ error: "Failed to load user win count" });
	}
};

export const losses = async (request: FastifyRequest, reply: FastifyReply): Promise<any> => {
	
	try {
		const { username } = request.params as { username: string };
		
		const user = await request.server.prisma.user.findUnique({
			where: { username }
		});

		return reply.code(200).send(user.losses);
	} catch (error) {
		console.error(error);
		return reply.code(500).send({ error: "Failed to load user loss count" });
	}
};
