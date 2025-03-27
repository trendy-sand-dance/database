import { FastifyRequest, FastifyReply } from 'fastify';

export async function addUserDev(request: FastifyRequest, reply: FastifyReply): Promise<void> {
  const { username, email, password } = request.body as { username: string, email: string, password: string };
  try {
    const db = request.server.db;
    if (!db) {
      console.error("Database is not initialized");
      return reply.code(500).send({ error: "Database connection error" });
    }

    const stmt = db.prepare("INSERT INTO userTable (username, password, email, status) VALUES (?, ?, ?, ?)");
    const result = stmt.run(username, password, email, 0);
    return reply.code(200).send({ message: `New user added: ${username}`, id: result.lastInsertRowid });
  }
  catch (err) {
    console.log(err);
    return reply.code(500).send({ error: "Registration failed" });
  }
};
