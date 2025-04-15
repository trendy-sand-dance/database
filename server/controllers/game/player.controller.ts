import { FastifyRequest, FastifyReply } from 'fastify';

export const getPlayer = async (request: FastifyRequest, reply: FastifyReply): Promise<any> => {

  try {
    const { username } = request.params as { username: string };

    const user = await request.server.prisma.user.findUnique({
      where: { username },
      select: {
        player: true,
      },
    })
    return reply.code(200).send(user);
  } catch (error) {
    console.error(error);
    return reply.code(500).send({ error: "Failed to load user" });
  }
};

export const updatePlayer = async (request: FastifyRequest, reply: FastifyReply): Promise<any> => {

  try {
    const { username } = request.params as { username: string };
    const position = request.body as { x: number, y: number };

    await request.server.prisma.user.update({
      where: { username },
      select: {
        player: true,
      },
      data: {
        player: {
          update: {
            x: position.x,
            y: position.y,
          },
        },
      },
    });
    return reply.code(204);
  } catch (error) {
    console.error(error);
    return reply.code(500).send({ error: "Failed to update user" });
  }
};
