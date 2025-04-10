import { FastifyRequest, FastifyReply } from 'fastify';

export const logout = async (request: FastifyRequest, reply: FastifyReply): Promise<any> => {
	try {
		const { username } = request.params as { username: string };

		await request.server.prisma.user.update({
			where: {
				username: username,
			},
			data: {
				status: false
			},
		});
		return reply.code(200).send({ message: "Logout successful" });
	} catch (error) {
		console.error(error);
		return reply.code(500).send({ error: "Failed to logout" });
	}
};

