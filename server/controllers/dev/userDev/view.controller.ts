import { FastifyRequest, FastifyReply } from 'fastify';
import { formatMatchDate } from '../../utils/matchUtils.controller';
import { getAllFriends } from '../../utils/friendUtils.controller';

export async function populate(request: FastifyRequest, reply: FastifyReply) {
	try {
		await request.server.prisma.user.createMany({
			data: [
				{ username: "tim", password: "tim", email: "tim@tim.com"},
				{ username: "bill", password: "bill", email: "bill@bill.com"},
				{ username: "jill", password: "jill", email: "jill@jill.com"},
				{ username: "molly", password: "molly", email: "molly@molly.com"},
			]
		  });
		  const createdUsers = await request.server.prisma.user.findMany({
			where: {
			  username: { in: ["tim", "bill", "jill", "molly"] }
			}
		  });
		  await Promise.all(
			createdUsers.map(user =>
			  request.server.prisma.player.create({
				data: {
				  userId: user.id,
				  // set x, y etc
				}
			  })
			)
		  );
		
		return reply.send({ message: "populated user table with 4 users"});
		
	} catch (error) {
		return reply.code(500).send("Error populating user table");
	}
};

export const viewDB = async (request: FastifyRequest, reply: FastifyReply): Promise<any> => {
	try {
	  const allUsers = await request.server.prisma.user.findMany();

	  const users = await Promise.all(allUsers.map(async user => {
		  const friends = await getAllFriends(user.id, request);
		  return { ...user, friends };
		}));

		const players = await request.server.prisma.player.findMany();
	
		const matches = await request.server.prisma.match.findMany();
		const formattedMatches = matches.map(formatMatchDate);

		reply.send({ users: users, players: players, matches: formattedMatches });

	} catch (error) {
	  return reply.status(500).send({ error: 'Failed to fetch users' });
	}
  };
  
export const viewID = async (request: FastifyRequest, reply: FastifyReply): Promise<any> => {
	try {
		const { id } = request.params as { id: string };
		const user = await request.server.prisma.user.findUnique({ where: { id: parseInt(id, 10) } });
		reply.send(user);
	} catch (error) {
		reply.status(404).send({ error: 'Failed to fetch user via ID, user not found' });
	}
};
