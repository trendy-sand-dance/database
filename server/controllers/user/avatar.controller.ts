import { FastifyRequest, FastifyReply } from 'fastify';

export const editAvatar = async (request: FastifyRequest, reply: FastifyReply): Promise<any> => {
	try {
		const { username } = request.params as { username: string };
		const { filename } = request.body as { filename: string };
		await request.server.prisma.user.update({
		where: { username: username },
		data: {
			avatar: filename
			},
		});
		return reply.code(200).send({ message: "Updated avatar successfully"});
	} catch (error) {
		console.error(error);
		return reply.code(500).send({ error: "Failed to updated new avatar" });
	}
};

export const deleteAvatar = async (request: FastifyRequest, reply: FastifyReply): Promise<any> => {
	try {
		const { username } = request.params as { username: string };
	
		await request.server.prisma.user.update({
            where: { username: username },
			data: {
				avatar: "img_avatar.png"
			},
        });
		return reply.code(200).send({ message: "Deleted avatar successfully"});
	} catch (error) {
		console.error(error);
		return reply.code(500).send({ error: "Failed to delete avatar" });
	}
};
