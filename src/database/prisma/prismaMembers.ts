import { FastifyRequest, FastifyReply } from 'fastify';

export async function getPrismaUsers(request: FastifyRequest, reply: FastifyReply): Promise<void> {
    try {
        const users = await request.server.prisma.user.findMany();
        reply.send(users);
    } catch (error) {
        reply.status(500).send({ error: 'Failed to fetch users' });
    }
}     