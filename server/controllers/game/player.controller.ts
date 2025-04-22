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

export const getPlayerInfo = async (request: FastifyRequest, reply: FastifyReply): Promise<any> => {

  try {
    const { id } = request.params as { id: number };

    const user = await request.server.prisma.user.findUnique({
      where: { id: Number(id) },
      select: {
        username: true,
        avatar: true,
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
    const { id } = request.params as { id: number };
    const position = request.body as { x: number, y: number };

    await request.server.prisma.user.update({
      where: { id: Number(id) },
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
