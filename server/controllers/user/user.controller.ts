import { FastifyRequest, FastifyReply } from 'fastify';

export const getUser = async (request: FastifyRequest, reply: FastifyReply): Promise<any> => {

  try {
    const { id } = request.params as { id: number };
		const userId = Number(id);
		console.log("userid : ", userId)

    const user = await request.server.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        username: true,
        email: true,
        status: true,
        avatar: true,
        password: false,
        player: true,
      }
    });

    return reply.code(200).send(user);
  } catch (error) {
    console.error(error);
    return reply.code(500).send({ error: "Failed to load user dashboard" });
  }
};
