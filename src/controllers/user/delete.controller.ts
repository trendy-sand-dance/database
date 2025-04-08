import { FastifyRequest, FastifyReply } from 'fastify';

export const deleteUser = async (request: FastifyRequest, reply: FastifyReply): Promise<any> => {
	try {
		const { username } = request.params as { username: string };
	
		await request.server.prisma.user.delete({
            where: {
				username: username
			},
        });
		reply.code(200);
	} catch (error) {
		console.error(error);
		reply.code(500).send({ error: 'Failed to delete user' });
	}
};
