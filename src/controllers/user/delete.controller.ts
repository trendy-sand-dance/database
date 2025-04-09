import { FastifyRequest, FastifyReply } from 'fastify';

export const deleteUser = async (request: FastifyRequest, reply: FastifyReply): Promise<any> => {
	try {
		const { username } = request.params as { username: string };
	
		await request.server.prisma.user.delete({
            where: {
				username: username
			},
        });
		return reply.code(200).send({ message: "Deleted user successfully"});
	} catch (error) {
		console.error(error);
		return reply.code(500).send({ error: "Failed to delete user" });
	}
};
