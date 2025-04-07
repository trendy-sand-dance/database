import { FastifyRequest, FastifyReply } from 'fastify';

export async function editDev(request: FastifyRequest, reply: FastifyReply): Promise<void> {

	const username = "flip";
	const newUsername = "flop";
	const password = "hoi";
	const newPassword = "hi";
	try {
		const db = request.server.db;
		if (!db) {
			console.error("Database is not initialized");
			return reply.send({ error: "Database connection error" });
		}
		const stmt = db.prepare('SELECT * FROM userTable WHERE username = ? AND password = ?');
		const user = stmt.get(username, password);
		if (user) {
			if (user.status == true) {
				const stmt = db.prepare("UPDATE userTable SET username = ?, password = ? WHERE username = ? AND password = ?");
				const result = stmt.run(newUsername, newPassword, username, password);
				if (result.changes > 0)
					return reply.send({ message: `User successfully edited: ${username} to ${newUsername}, ${password} to ${newPassword}` });
				else
					return reply.send({ error: "No matching user found or no changes made" });
			}
			else
				return reply.send({ error: "user status = not logged in" });
		}
		else
			reply.send({ error: "Invalid credentials" });
	}
	catch (err) {
		console.log(err);
		return reply.send({ error: "Edit user failed" });
	}
};
