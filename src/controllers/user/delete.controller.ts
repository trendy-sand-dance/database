import { FastifyRequest, FastifyReply } from 'fastify';

export const deleteUser = async (request: FastifyRequest, reply: FastifyReply): Promise<any> => {
    try {
		const { username, password } = request.body as { username: string, password: string };
		const deletedUser = await request.server.prisma.user.delete({
            where: {
				username: username,
				password: password
			},
        });
		console.log("successfully deleted user from user table");
    } catch (error) {
		console.log("failed to delete user from user table");
    }
};
