import { FastifyRequest, FastifyReply } from 'fastify';

export const getStats = async (request: FastifyRequest, reply: FastifyReply): Promise<any> => {
	try {
		const { username } = request.params as { username: string };
		const user = await request.server.prisma.user.findUnique({
			where: { username },
			select: {
				wins: true, 
				losses: true,
			}
		});

	return reply.code(200).send(user.wins, user.losses);
	} catch (error) {
		reply.status(500).send({ error: 'Failed to fetch user statistics' });
	}
};

export const updateWins = async (request: FastifyRequest, reply: FastifyReply): Promise<any> => {
	try {
		const { username } = request.params as { username: string };
		const user = request.server.prisma.user.findUnique({
			where: { username: username }
		});
		if (!user)
			return reply.code(406).send({ error: "Can't find user" });
		const winCount = user.wins;
		await request.server.prisma.user.update({
			where: { username },
			data: { 
				wins: winCount + 1,
			}
		});

	return reply.code(200).send({ message: "Successfully updated user win count" });
	} catch (error) {
		reply.status(500).send({ error: 'Failed to update user win count' });
	}
};

export const updateLosses = async (request: FastifyRequest, reply: FastifyReply): Promise<any> => {
	try {
		const { username } = request.params as { username: string };
		const user = request.server.prisma.user.findUnique({
			where: { username: username }
		});
		if (!user)
			return reply.code(406).send({ error: "Can't find user" });
		const lossCount = user.losses;
		await request.server.prisma.user.update({
			where: { username },
			data: { 
				losses: lossCount + 1,
			}
		});

	return reply.code(200).send({ message: "Successfully updated user loss count" });
	} catch (error) {
		reply.status(500).send({ error: 'Failed to update user loss count' });
	}
};

