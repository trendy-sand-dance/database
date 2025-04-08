import { FastifyRequest, FastifyReply } from 'fastify';

export const login = async (request: FastifyRequest, reply: FastifyReply): Promise<any> => {
	try {
		const { username, password } = request.body as { username: string, password: string };

		const user = await request.server.prisma.user.findUnique({
			where: { username: username, password: password }});
		if (!user)
			return reply.code(406).send({ error: 'Invalid credentials' });

		await request.server.prisma.user.update({
			where: {
				username: username
			},
			data: {
				status: true
			},
		});
		reply.code(200);
	} catch (error) {
		console.error(error);
		return reply.code(500).send({ error: 'Failed to log user in' });
	}
};
