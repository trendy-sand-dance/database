import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';

// delete user
export async function deleteMemberDev(fastify: FastifyInstance, request: FastifyRequest, reply: FastifyReply): Promise<void> {
    try {
		
		const { username, password, email, avatar, status } = { username: "joppe", password: "pass", email: "something", avatar: "file_path", status: true };
		const deletedUser = await fastify.prisma.user.delete({
            where: {
				username: 'julia',
				password: 'juul',
				email: 'julia@email.com',
				avatar: "file_path_julia",
				status: true
			},
        });
		console.log("successfully deleted user from user table");
    } catch (error) {
		console.log("failed to delete user from user table");
    }
}