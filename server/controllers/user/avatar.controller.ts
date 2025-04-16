import { FastifyRequest, FastifyReply } from 'fastify';

export const editAvatar = async (request: FastifyRequest, reply: FastifyReply): Promise<any> => {
	try {
		const { username } = request.params as { username: string };
		const { newAvatar } = request.body as { newAvatar: string };
		console.log("nfilename in datbase: ", newAvatar);
		await request.server.prisma.user.update({
		where: { username: username },
		data: {
			avatar: newAvatar
			},
		});
		console.log("updated user - ", request.server.prisma.user.username, "  ", request.server.prisma.user.avatar);
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
