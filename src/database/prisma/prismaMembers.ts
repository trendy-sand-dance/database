import { FastifyRequest, FastifyReply } from 'fastify';

import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export async function getPrismaUsers(request: FastifyRequest, reply: FastifyReply): Promise<void> {
    try {
        const users = await prisma.user.findMany();
        reply.send(users);
    } catch (error) {
        reply.status(500).send({ error: 'Failed to fetch users' });
    }
};