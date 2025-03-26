import { FastifyRequest, FastifyReply } from 'fastify';

export async function addUserDev(request: FastifyRequest, reply: FastifyReply): Promise<void> {

	//const username = "<username>";
	//const password = "<password>";
	//const email = "<email>";
	const username = "<username>";
	const password = "<password>";
	const email = "<email>";
	try {
		const db = request.server.db;
		if (!db) {
			console.error("Database is not initialized");
			return reply.send({ error: "Database connection error" });
		}

		const stmt = db.prepare("INSERT INTO userTable (username, password, email, status) VALUES (?, ?, ?, ?)");
		const result = stmt.run(username, password, email, 0);
		return reply.send({ message: `New user added: ${username}`, id: result.lastInsertRowid });
	}
	catch (err) {
		console.log(err);
		return reply.send({ error: "Registration failed" });
	}
};
