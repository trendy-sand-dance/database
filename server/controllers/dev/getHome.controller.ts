import { FastifyRequest, FastifyReply } from 'fastify';


export async function getHome(request: FastifyRequest, reply: FastifyReply) {
	return reply.send({ message: "home page" });
};

export async function populate(request: FastifyRequest, reply: FastifyReply) {
	try {
		await request.server.prisma.user.createMany({
			data: [
				{ username: "tim", password: "tim", email: "tim@tim.com"},
				{ username: "bob", password: "bob", email: "bob@bob.com"},
				{ username: "jill", password: "jill", email: "jill@jill.com"},
				{ username: "molly", password: "molly", email: "molly@molly.com"},
			]
		  });
		return reply.send({ message: "populated user table with 4 users"});
		
	} catch (error) {
		return reply.code(500).send("ERROR POPULATING USER TABLE");
	}
};