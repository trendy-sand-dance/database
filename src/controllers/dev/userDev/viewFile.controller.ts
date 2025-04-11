import { FastifyRequest, FastifyReply } from 'fastify';

export const viewFile = async (request: FastifyRequest, reply: FastifyReply): Promise<any> => {
	try {
		
		const { username } = request.params as { username: string };
		const user = await request.server.prisma.user.findUnique( {
			where: {username: username}});

		const filePath = `../../../uploads/${user.avatar}`;
		
		// view uploaded avatar per user

		reply.send(user);
	} catch (error) {
		reply.status(500).send({ error: 'Failed to fetch file' });
	}
};