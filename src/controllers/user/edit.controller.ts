import { FastifyRequest, FastifyReply } from 'fastify';

export const editUsername = async (request: FastifyRequest, reply: FastifyReply): Promise<any> => {
    try {
		const { username } = request.params as { username: string };
		const user = await request.server.prisma.user.findUnique({
			where: { username }
		});
		await request.server.prisma.user.update({
            where: { username },
			data: {
				username: username
			},
        });
		reply.code(201).send(user);
	} catch (error) {
		reply.status(500).send({ error: 'Failed to edit username' });
	}
};

//export const editPassword = async (request: FastifyRequest, reply: FastifyReply): Promise<any> => {
//    try {
//		const { username, password } = request.body as { username: string, password: string };
//		const user = await request.server.prisma.user.findUnique({
//			where: { username, password}
//		});
//		await request.server.prisma.user.update({
//            where: { username },
//			data: {
//				password: password
//			},
//        });
//		reply.code(201).send(user);
//	} catch (error) {
//		reply.status(500).send({ error: 'Failed to edit password' });
//	}
//};
