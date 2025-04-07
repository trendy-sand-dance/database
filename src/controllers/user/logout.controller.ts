import { FastifyRequest, FastifyReply } from 'fastify';

/** 
 * @todo  use the userRequest struct somehow instead of creating avatar and status variables 
 * FastifyRequest<{ Body: FastifyReply.UserRequest }>
 * 
*/

export const logout = async (request: FastifyRequest, reply: FastifyReply): Promise<any> => {
	// do i get passed the username? how do i know here who to logout
	try {
		const { username } = request.params as { username: string };
		
		const user = await request.server.prisma.user.findUnique({
			where: { username }
		});

		await request.server.prisma.user.update({
		where: {
			username: user,
		},
		data: {
			status: false
		}
		})
		
		reply.code(201).send(user);
	} catch (error) {
		reply.status(500).send({ error: 'Failed to log user out' });
	}
};
