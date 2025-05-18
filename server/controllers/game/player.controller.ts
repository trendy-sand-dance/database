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

export const getUserInfo = async (request: FastifyRequest, reply: FastifyReply): Promise<any> => {

  try {

    const { id } = request.params as { id: number };

    const user = await request.server.prisma.user.findUnique({
      where: { id: Number(id) },
      select: {
        id: true,
        username: true,
        status: true,
        avatar: true,
        wins: true,
        losses: true,
        player: true,
      },
    })
    return reply.code(200).send({ user });
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
    return reply.code(204).send("Success");
  } catch (error) {
    console.error(error);
    return reply.code(500).send({ error: "Failed to update user" });
  }
};

export interface Vector2 {
  x: number;
  y: number;
}

// type Player = {
//   id : number;
//   position: Vector2;
// }

// type PlayersMap = Record<number, Vector2>;

// // TODO: MAKE THIS SYNC DB FUNCTION WORK
export const syncPlayers = async (request: FastifyRequest, reply: FastifyReply): Promise<any> => {

  console.log("/syncPlayers");
  try {
    // const players = request.body as PlayersMap;
    const playerMap = request.body as Map<number, Vector2>;
    // const obj = Object.entries(players);
    //  console.log("Proceeding to sync players...", obj[0]);
    //  if (obj.length === 0)
    //  {
    // throw { code: 500, message: "Error, received playersmap is empty" };
    //  }

    const players = Array.from(playerMap.entries());
    for (const player of players) {
      // console.log(`Updating ${id} with ${position}...`);
      console.log(`Updating ${player}...`);


      // const response = await request.server.prisma.player.update({
      //   where: { id: Number(id) },
      //   data: {
      //     x: position.x,
      //     y: position.y,
      //   }
      // });

      // if (!response.ok)
      // {
      //   console.log("WWWWWWWWWWWWTTTTTTTTTTTTF");
      // }
    }
    console.log("Finished??????");
    return reply.code(200);
  } catch (error) {
    console.error(error);
    return reply.code(500).send({ error: "Failed to update users" });
  }
};
