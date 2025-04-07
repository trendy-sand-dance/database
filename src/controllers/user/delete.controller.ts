import { FastifyRequest, FastifyReply } from 'fastify';

export const deleteUser = async (request: FastifyRequest, reply: FastifyReply): Promise<any> => {
    try {
		const { username } = request.params as { username: string };
		const deletedUser = await request.server.prisma.user.delete({
            where: {
				username: username
			},
        });
		reply.code(201).send(deletedUser);
	} catch (error) {
		reply.status(500).send({ error: 'Failed to delete user' });
	}
};
