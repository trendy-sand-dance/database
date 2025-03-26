import { FastifyRequest, FastifyReply } from 'fastify';

export async function addGameData(request: FastifyRequest, reply: FastifyReply): Promise<void> {

	const gameThing1 = "information";
	const gameThing2 = "for our game";

	try {
		const db = request.server.db;
		if (!db) {
			console.error("Database is not initialized");
			return reply.send({ error: "Database connection error" });
		}

		const stmt = db.prepare("INSERT INTO gameTable (random, something) VALUES (?, ?)");
		const result = stmt.run(gameThing1, gameThing2);
		return reply.send({ message: `Info added: ${gameThing1}, ${gameThing2}`, id: result.lastInsertRowid });
	}
	catch (err) {
		console.log(err);
		return reply.send({ error: "Registration failed" });
	}
};
