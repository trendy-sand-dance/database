import { FastifyRequest, FastifyReply } from 'fastify';

export async function changeUserStatusDev(request: FastifyRequest, reply: FastifyReply): Promise<void> {

	//const username = "<username>";
	//const password = "<password>";
	const username = "<username>";
	const password = "<password>";
	try {
		const db = request.server.db;
		if (!db) {
			console.error("Database is not initialized");
			return reply.send({ error: "Database connection error" });
		}
		const stmt = db.prepare('SELECT * FROM userTable WHERE username = ? AND password = ?');
		const user = stmt.get(username, password);
		if (user) {
			if (user.status == 1) {
				const stmt = db.prepare("UPDATE userTable SET status = ? WHERE username = ? AND password = ?");
				const result = stmt.run(0, username, password);
			}
			else if (user.status == 0) {
				const stmt = db.prepare("UPDATE userTable SET status = ? WHERE username = ? AND password = ?");
				const result = stmt.run(1, username, password);
			}
		}
	}
	catch (err) {
		console.log(err);
		return reply.send({ error: "Edit user failed" });
	}
};
