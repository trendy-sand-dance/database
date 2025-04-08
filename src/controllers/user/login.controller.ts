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
			where: { username: username, password: password }});
		console.log("user = ", user.username, " pass = ", user.password, " id = ", user.id);
		if (user)
			console.log("FOUND USER");
		
		//console.log(`user pass = ${request.server.prisma.user.password}, pass = ${password}`);
		//if (password !== request.server.prisma.user.password)
		//	reply.status(500).send({ error: 'wrong password' });
		//const isPasswordValid = await request.server.prisma.user.compare(password, request.server.prisma.user.password);
		//if (!isPasswordValid)
		//await request.server.prisma.user.update({
		//	where: {
		//		username: username
		//	},
		//	data: {
		//		status: true
		//	},
		//});
		// only send yay or nee, then dash is triggered to send the specific user via request.params
		
		reply.code(200);
	} catch (error) {
		reply.status(500).send({ error: 'Failed to log user in' });
	}
};
