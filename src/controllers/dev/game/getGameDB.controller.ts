import { FastifyRequest, FastifyReply } from 'fastify';

export async function getGameDB(request: FastifyRequest, reply: FastifyReply): Promise<void> {

	const db = request.server.db;
	if (!db)
		return reply.send({ error: "Database connection error" });

	const query = `SELECT * FROM gameTable`;
	const userTable = db.prepare(query).all();
	return reply.send({ title: "Home", userTable });

};
