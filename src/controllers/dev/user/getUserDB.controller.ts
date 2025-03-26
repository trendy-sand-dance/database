import { FastifyRequest, FastifyReply } from 'fastify';

export async function getUserDB(request: FastifyRequest, reply: FastifyReply): Promise<void> {

	const db = request.server.db;
	if (!db)
		return reply.send({ error: "Database connection error" });

	const query = `SELECT * FROM userTable`;
	const userTable = db.prepare(query).all();
	return reply.send({ title: "Home", userTable });

};
