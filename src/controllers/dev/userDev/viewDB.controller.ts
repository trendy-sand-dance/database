import { FastifyRequest, FastifyReply } from 'fastify';

export const viewDB = async (request: FastifyRequest, reply: FastifyReply): Promise<any> => {
  try {
    const users = await request.server.prisma.user.findMany();
    const players = await request.server.prisma.player.findMany();

    reply.send({ users: users, players: players });
  } catch (error) {
    reply.status(500).send({ error: 'Failed to fetch users' });
  }
};
