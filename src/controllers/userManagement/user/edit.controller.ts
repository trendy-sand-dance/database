import { FastifyRequest, FastifyReply } from 'fastify';

export const editUsername = async (request: FastifyRequest, reply: FastifyReply): Promise<any> => {
	try {
		const { username } = request.params as { username: string };
		const { newUsername } = request.body as { newUsername: string };

		await request.server.prisma.user.update({
            where: { username: username },
			data: {
				username: newUsername
			},
        });
		return reply.code(200).send({ message: "Edited username successfully"});
	} catch (error) {
		console.error(error);
		return reply.code(500).send({ error: "Failed to edit username" });
	}
};

export const editPassword = async (request: FastifyRequest, reply: FastifyReply): Promise<any> => {
	try {
		const { username } = request.body as { username: string };
		const { newPassword } = request.body as { newPassword: string };

		await request.server.prisma.user.update({
            where: { username: username },
			data: {
				password: newPassword
			},
        });
		return reply.code(200).send({ message: "Edited password successfully"});
	} catch (error) {
		console.error(error);
		return reply.code(500).send({ error: "Failed to edit password" });
	}
};

export const editEmail = async (request: FastifyRequest, reply: FastifyReply): Promise<any> => {
	try {
		const { username } = request.body as { username: string };
		const { newEmail } = request.body as { newEmail: string };

		await request.server.prisma.user.update({
            where: { username: username },
			data: {
				email: newEmail
			},
        });
		return reply.code(200).send({ message: "Edited email successfully"});
	} catch (error) {
		console.error(error);
		return reply.code(500).send({ error: "Failed to edit email" });
	}
};
