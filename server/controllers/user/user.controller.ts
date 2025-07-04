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
        password: true,
        wins: true,
        losses: true,
        player: true,
      }
    });


	if (user)
	{
			// if not a google user password will be empty instead of undefined/null
			if (user.password)
				user.password = ""
		console.log("returning user: ", user);
		return reply.code(200).send(user);
	}
	else 
		return reply.code(404).send({ error: "User not found" });
  } catch (error) {
    console.error(error);
    return reply.code(500).send({ error: "Failed to load user dashboard" });
  }
};
