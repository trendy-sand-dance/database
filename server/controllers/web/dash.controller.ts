import { FastifyRequest, FastifyReply } from 'fastify';

const GAMESERVER_URL: string = "http://gameserver:3000";
export const dash = async (request: FastifyRequest, reply: FastifyReply): Promise<any> => {

  try {
    const { username } = request.params as { username: string };

    const user = await request.server.prisma.user.findUnique({
      where: { username },
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

    // TODO: mark the addPlayer controller now as deprecated
    // const response = await fetch(`${GAMESERVER_URL}/add/${username}`, {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify({ id: user.id, username: user.username, avatar: user.avatar, x: user.player.x, y: user.player.y })
    // });

    return reply.code(200).send(user);
  } catch (error) {
    console.error(error);
    return reply.code(500).send({ error: "Failed to load user dashboard" });
  }
};

// const response = await fetch(`${USERMANAGEMENT_URL}/login`, {
//   method: 'POST',
//   headers: {
//     'Content-Type': 'application/json',
//   },
//   body: JSON.stringify(userInfo)
// });
