import { FastifyRequest, FastifyReply } from 'fastify';

/** 
 * @todo  use the userRequest struct somehow instead of creating avatar and status variables 
 * FastifyRequest<{ Body: FastifyReply.UserRequest }>
 * 
*/

export const login = async (request: FastifyRequest, reply: FastifyReply): Promise<any> => {
	try {
		const { username, password } = request.body as { username: string, password: string };
		//if (!username || !password)
				// how do we want to handle this? - frontend ?
		
		const user = await request.server.prisma.user.findUnique({
			where: { username }
		});
		// if user not found, handle in frontend?
		
		const isPasswordValid = await request.server.prisma.user.compare(password, request.server.prisma.user.password);
		if (!isPasswordValid)
			reply.status(500).send({ error: 'wrong password' });
		
		await request.server.prisma.user.update({
			where: {
				username: user,
			},
			data: {
				status: true
			}
			})
		
		reply.code(201).send(user);
	} catch (error) {
		reply.status(500).send({ error: 'Failed to log user in' });
	}
};
