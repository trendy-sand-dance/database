import { FastifyRequest, FastifyReply } from 'fastify';

interface UserRequest {
	username: string;
	password: string;
	email: string;
	avatar: string;
	status: boolean;
}

import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

// create many table members
export async function createMany(request: FastifyRequest<{ Body: UserRequest }>, reply: FastifyReply): Promise<void> {
    try {
		const createMany = await prisma.user.createMany({
			data: [
				{ username: 'flip', password: 'flop', email: 'flipflop@email.com', avatar: "file_path_flip", status: true},
				{ username: 'merlin', password: 'merl', email: 'merlin@email.com', avatar: "file_path_merlin", status: true},
				{ username: 'joppe', password: 'jop', email: 'joppe@email.com', avatar: "file_path_joppe", status: true},
				{ username: 'bob', password: 'bobobo', email: 'bob@email.com', avatar: "file_path_bob", status: true},
				{ username: 'dave', password: 'daveywavey', email: 'dave@email.com', avatar: "file_path_dave", status: true},
				{ username: 'julia', password: 'juul', email: 'julia@email.com', avatar: "file_path_julia", status: true}
			]
		});
		reply.status(201).send(createMany);
    } catch (error) {
        reply.status(500).send({ error: 'Failed to add user' });
    }
}