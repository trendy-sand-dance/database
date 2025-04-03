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

// delete user
export async function deleteMember(request: FastifyRequest<{ Body: UserRequest }>, reply: FastifyReply): Promise<void> {
    try {
        //const { username, password, email, avatar, status } = request.body;
		
		const { username, password, email, avatar, status } = { username: "joppe", password: "pass", email: "something", avatar: "file_path", status: true };
		const deletedUser = await prisma.user.delete({
            where: {
				username: 'julia',
				password: 'juul',
				email: 'julia@email.com',
				avatar: "file_path_julia",
				status: true
			},
        });
		console.log("success!");
		//reply.status(201).send( { message: 'successfully deleted user' });
    } catch (error) {
		console.log("faill");
        //reply.status(500).send({ error: 'Failed to delete user' });
    }
}