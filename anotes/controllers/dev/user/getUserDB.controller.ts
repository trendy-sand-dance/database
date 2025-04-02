import { FastifyRequest, FastifyReply } from 'fastify';

export async function getUserDB(request: FastifyRequest, reply: FastifyReply): Promise<void> {
  // const { username } = request.params as { username: string };
  const db = request.server.db;
  if (!db)
    return reply.send({ error: "Database connection error" });

  const query = `SELECT * FROM userTable`;
  const userTable = db.prepare(query).all();
  return reply.code(200).send({ title: "Home", userTable });

};
