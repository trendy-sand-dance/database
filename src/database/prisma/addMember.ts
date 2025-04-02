import { FastifyRequest, FastifyReply } from 'fastify';

interface UserRequest {
	username: string;
	password: string;
	email: string;
	avatar: string;
	status: boolean;
}

// Fetch all users
export async function addMember(request: FastifyRequest<{ Body: UserRequest }>, reply: FastifyReply): Promise<void> {
    try {
        //const { username, password, email, avatar, status } = request.body;
		
		const { username, password, email, avatar, status } = { username: "sarah", password: "pass", email: "something", avatar: "file_path", status: true };
		 // Insert user into the database
		 const newUser = await request.server.prisma.user.create({
            data: {
                username,
                password,
                email, // Now included
                avatar: avatar || '', // Default empty string if not provided
                status: status ?? false, // Default to false if not provided
            },
        });

		reply.status(201).send(newUser);
    } catch (error) {
        reply.status(500).send({ error: 'Failed to add user' });
    }
}