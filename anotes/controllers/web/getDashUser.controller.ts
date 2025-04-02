import { FastifyRequest, FastifyReply } from 'fastify';

export async function getDashUser(request: FastifyRequest, reply: FastifyReply): Promise<void> {

	const { username } = request.params as { username: string };
	try {
		const db = request.server.db;
		if (!db) {
			console.error("Database is not initialized");
			return reply.send({ error: "Database connection error"});
		}
		const stmt = db.prepare('SELECT * FROM userTable WHERE username = ?');
		const user = stmt.get(username);
		if (user) {
			const email = user.email as { email: string};
			reply.send({email});
		}
		else
			reply.send({ error: "Invalid credentials/something aint right" });
	}
	catch (err) {
		console.log(err);
		return reply.send({ error: "go back" });
	}
};
