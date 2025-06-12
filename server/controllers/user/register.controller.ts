import { FastifyRequest, FastifyReply } from 'fastify';

export const register = async (request: FastifyRequest, reply: FastifyReply): Promise<any> => {
  try {
    const { username, password, email, gooAuth } = request.body as { username: string, password?: string, email: string, gooAuth?: boolean };
    const { avatar, status } = { avatar: "img_avatar.png", status: false };

		if (password == null && gooAuth == null)
		{
    	return reply.code(418).send({ error: "password cannot be empty!" });
		}

		let password_tmp = "";

		if (password && !gooAuth)
		{
			password_tmp = password;
		}

    await request.server.prisma.user.create({
      data: {
        username,
        password: password_tmp,
        email,
        avatar,
				gooAuth,
        status,
        player: {
          create: {
          }
        }
      },
    });
    return reply.code(201).send({ message: "Registration successful" });
  } catch (error) {
    console.error(error);
    return reply.code(500).send({ error: "Failed to create new user" });
  }
};


export const login_old = async (request: FastifyRequest, reply: FastifyReply): Promise<any> => {
  try {
    const { username, password } = request.body as { username: string, password: string };

    const user = await request.server.prisma.user.findUnique({
      where: { username: username, password: password }
    });
    if (!user)
      return reply.code(406).send({ error: "Invalid credentials" });

    await request.server.prisma.user.update({
      where: {
        username: username
      },
      data: {
        status: true
      },
    });
    return reply.code(200).send({ message: "Login successful" });
  } catch (error) {
    console.error(error);
    return reply.code(500).send({ error: "Failed to log user in" });
  }
};

export const login = async (request: FastifyRequest, reply: FastifyReply): Promise<any> => {
  try {
    const { username, password, gooAuth } = request.body as { username: string, password: string, gooAuth?: boolean};


		let passwd = password;

		if (gooAuth)
			passwd = "";

    const user = await request.server.prisma.user.findUnique({
      where: {
        username: username,
        password: passwd
      },
      omit: {
        password: true,
      },
      include: {
        player: true,
      }
    });
    if (!user)
      return reply.code(406).send({ error: "Invalid credentials" });

    await request.server.prisma.user.update({
      where: {
        username: username
      },
      data: {
        status: true
      },
    });
    return reply.code(200).send(user);
  } catch (error) {
    console.error(error);
    return reply.code(500).send({ error: "Failed to log user in" });
  }
};

export const logout = async (request: FastifyRequest, reply: FastifyReply): Promise<any> => {
  try {
    const { username } = request.params as { username: string };

    await request.server.prisma.user.update({
      where: {
        username: username,
      },
      data: {
        status: false
      },
    });

    return reply.code(200).send({ message: "Logout successful" });
  } catch (error) {
    console.error(error);
    return reply.code(500).send({ error: "Failed to logout" });
  }
};

