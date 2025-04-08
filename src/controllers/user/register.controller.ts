import { FastifyRequest, FastifyReply } from 'fastify';

export const register = async (request: FastifyRequest, reply: FastifyReply): Promise<any> => {
	try {
		const { username, password, email } = request.body as { username: string, password: string, email: string };
		const { avatar, status } = { avatar: "img_avatar.png", status: false };
		const user = await request.server.prisma.user.create({
			data: {
				username,
				password,
				email,
				avatar,
				status
			},
		});
		reply.code(201);
	} catch (error) {
		console.error(error);
		reply.code(500).send({ error: 'Failed to create new user' });
	}
};