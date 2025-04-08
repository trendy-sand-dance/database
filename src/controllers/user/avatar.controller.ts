import { FastifyRequest, FastifyReply } from 'fastify';

export const editAvatar = async (request: FastifyRequest, reply: FastifyReply): Promise<any> => {
	try {
		const { username } = request.params as { username: string };
		const { newAvatar } = request.body as { newAvatar: string };

		await request.server.prisma.user.update({
            where: { username: username },
			data: {
				avatar: newAvatar
			},
        });
		reply.code(200);
	} catch (error) {
		console.error(error);
		reply.code(500).send({ error: 'Failed to edit avatar' });
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
		reply.code(200);
	} catch (error) {
		console.error(error);
		reply.code(500).send({ error: 'Failed to delete avatar' });
	}
};
