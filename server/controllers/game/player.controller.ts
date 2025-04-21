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

export interface Vector2 {
  x: number;
  y: number;
}

// TODO: MAKE THIS SYNC DB FUNCTION WORK
// export const syncPlayers = async (request: FastifyRequest, reply: FastifyReply): Promise<any> => {
//
//   try {
//
//     const players = request.body as { players };
//
//     for (const [id, position] of players) {
//       await request.server.prisma.player.update({
//         where: { id: id },
//         data: {
//           x: position.x,
//           y: position.y,
//         }
//       });
//     }
//     return reply.code(200);
//   } catch (error) {
//     console.error(error);
//     return reply.code(500).send({ error: "Failed to update user" });
//   }
// };
