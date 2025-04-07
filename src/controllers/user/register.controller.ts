import { FastifyRequest, FastifyReply } from 'fastify';

/** 
 * @todo  use the userRequest struct somehow instead of creating avatar and status variables 
 * FastifyRequest<{ Body: FastifyReply.UserRequest }>
 * 
*/

export const register = async (request: FastifyRequest, reply: FastifyReply): Promise<any> => {
	try {
		const { username, password, email } = request.body as { username: string, password: string, email: string };
		const { avatar, status } = { avatar: "img_avatar.png", status: false };
		const user = await request.server.prisma.user.create({
			data: {
				username,
				password,
				email,
				avatar,
				status
			},
		});
		reply.code(201).send(user);
	} catch (error) {
		reply.status(500).send({ error: 'Failed to add user' });
	}
};
