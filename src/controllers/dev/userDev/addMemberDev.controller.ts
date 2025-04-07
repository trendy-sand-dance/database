import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';

// add one hardcoded member to user table
export async function addMemberDev(fastify: FastifyInstance, request: FastifyRequest, reply: FastifyReply): Promise<void> {
    try {

		const { username, password, email, avatar, status } = { username: "joppeeeee", password: "pass", email: "something", avatar: "file_path", status: true };
		 // Insert user into the database
		 const newUser = await fastify.prisma.user.create({
            data: {
                username,
                password,
                email,
                avatar: avatar || '', // Default empty string if not provided
                status: status ?? false, // Default to false if not provided
            },
        });
		reply.status(201).send(newUser);
    } catch (error) {
        reply.status(500).send({ error: 'Failed to add user' });
    }
}