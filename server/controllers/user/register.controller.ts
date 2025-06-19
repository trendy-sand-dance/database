import { PrismaClient, Prisma, User } from '@prisma/client';
import { FastifyRequest, FastifyReply } from 'fastify';
import bcrypt from 'bcrypt';

const SALT_ROUNDS = 10;

export const register = async (request: FastifyRequest, reply: FastifyReply): Promise<any> => {
  try {
    const {
			username,
			password,
			email
		} = request.body as {
			username: string,
			password: string,
			email: string
		};
    const {
			avatar,
			status
		} = {
				avatar: "img_avatar.png",
				status: false
			};

		const password_hash = await bcrypt.hash(password, SALT_ROUNDS);
    await request.server.prisma.user.create({
      data: {
        username,
        password: password_hash,
        email,
        avatar,
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



const create_user = async(db_client: PrismaClient, user: User): Promise<User> => {
	return await db_client.user.create({
		data: {
			username: user.username,
			email: user.email,
			avatar: user.avatar,
			status: user.status,
			player: {
				create: {
				}
			}
		},
	});
};

const find_user_email = async(db_client: PrismaClient, email: string): Promise<any> => {
	const usr = await db_client.user.findUnique({
		where: {
			email: email
		},
		omit: {
			password: true
		},
   include: {
      player: true,
    }
	});
	return usr;
}



export const login_google = async (request: FastifyRequest, reply: FastifyReply): Promise<any> => {
  try {
    const { username, email } = request.body as { username: string, email: string };

		let code = 200;
		let user = await find_user_email(request.server.prisma, email);

		// create user if doens't exist.
    if (!user)
		{
			const default_avatar = "img_avatar.png";
			user = await create_user(request.server.prisma, { username, email, avatar: default_avatar, status: false } as User);
			code = 201;
			if (!user)
			{
    		return reply.code(500).send({ error: "Failed to create new user for google account" });
			}
		}

		// set user's status.
		user = await request.server.prisma.user.update({
			where: { email: email },
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
			// we only need to username to be unique, instead of also the password.
      where: {
        username: username,
      },
      include: {
        player: true,
      }
    });


		// await console.log("db_password: ", user.password);
		// await console.log("password: ", password);
		// await console.log("password_hash: ", password_hash);
  	const isMatch = user && (await bcrypt.compare(password, user.password))
    if (!user || !isMatch)
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

