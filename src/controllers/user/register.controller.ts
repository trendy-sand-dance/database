import { FastifyRequest, FastifyReply } from 'fastify';

export const register = async (request: FastifyRequest, reply: FastifyReply): Promise<any> => {
	try {
		const { username, password, email } = request.body as { username: string, password: string, email: string };
		const { avatar, status } = { avatar: "img_avatar.png", status: false };
	
		await request.server.prisma.user.create({
			data: {
				username,
				password,
				email,
				avatar,
				status
			},
		});
		return reply.code(201).send({ message: "Registration successful" });
	} catch (error) {
		console.error(error);
		return reply.code(500).send({ error: "Failed to create new user" });
	}
};