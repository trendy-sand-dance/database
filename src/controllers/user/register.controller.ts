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

export const login = async (request: FastifyRequest, reply: FastifyReply): Promise<any> => {
	try {
		const { username, password } = request.body as { username: string, password: string };

		const user = await request.server.prisma.user.findUnique({
			where: { username: username, password: password }});
		if (!user)
			return reply.code(406).send({ error: "Invalid credentials" });
			
		await request.server.prisma.user.update({
			where: {
				username: username
			},
			data: {
				status: true
			},
		});
		return reply.code(200).send({ message: "Login successful" });
	} catch (error) {
		console.error(error);
		return reply.code(500).send({ error: "Failed to log user in" });
	}
};

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

