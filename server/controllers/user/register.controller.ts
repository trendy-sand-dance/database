import { PrismaClient, User } from '@prisma/client';
import { FastifyRequest, FastifyReply } from 'fastify';

export const register = async (request: FastifyRequest, reply: FastifyReply): Promise<any> => {
  try {
    const { username, password, email, gooAuth } = request.body as { username: string, password: string, email: string, gooAuth?: boolean };
    const { avatar, status } = { avatar: "img_avatar.png", status: false };

    await request.server.prisma.user.create({
      data: {
        username,
        password,
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


export const login_google = async (request: FastifyRequest, reply: FastifyReply): Promise<any> => {
  try {
    const { username, email } = request.body as { username: string, email: string };

		let code = 200;

		// try to find the user.
    const user = await request.server.prisma.user.findUnique({
      where: {
        username: username,
        email: email
      },
      omit: {
        password: true,
      },
    });


		// create user if doens't exist.
    if (!user)
		{
			const { avatar, status } = { avatar: "img_avatar.png", status: false };
			await request.server.prisma.user.create({
				data: {
					username,
					email,
					avatar,
					status,
					player: {
						create: {
						}
					}
				},
			});
			code = 201;
		}

		// set user's status.
		await request.server.prisma.user.update({
			where: { username: username },
			data: {	status: true },
		});

		return reply.code(code).send(user);
  } catch (error) {
    console.error(error);
    return reply.code(500).send({ error: "Failed to log user in" });
  }
};

export const login = async (request: FastifyRequest, reply: FastifyReply): Promise<User> => {
  try {
    const { username, password } = request.body as { username: string, password: string };

    const user = await request.server.prisma.user.findUnique({
      where: {
        username: username,
        password: password
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

