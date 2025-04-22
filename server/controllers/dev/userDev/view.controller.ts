import { FastifyRequest, FastifyReply } from 'fastify';

export const viewDB = async (request: FastifyRequest, reply: FastifyReply): Promise<any> => {
	try {
	  const users = await request.server.prisma.user.findMany();
	  const players = await request.server.prisma.player.findMany();
	  const friends = await request.server.prisma.user.friends.findMany();
  
	  reply.send({ users: users, players: players, friends: friends });
	} catch (error) {
	  reply.status(500).send({ error: 'Failed to fetch users' });
	}
  };
  
export const viewID = async (request: FastifyRequest, reply: FastifyReply): Promise<any> => {
	try {
		const { id } = request.params as { id: string };
		const user = await request.server.prisma.user.findUnique({ where: { id: parseInt(id, 10) } });
		reply.send(user);
	} catch (error) {
		reply.status(404).send({ error: 'Failed to fetch user via ID, user not found' });
	}
};
