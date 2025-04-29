import { FastifyRequest, FastifyReply } from 'fastify';
import { formatDate } from '../../utils/matchUtils.controller';
import { getAllFriends } from '../../utils/friendUtils.controller';

export async function populate(request: FastifyRequest, reply: FastifyReply) {
	try {
		await request.server.prisma.user.createMany({
			data: [
				{ username: "tim", password: "tim", email: "tim@tim.com"},
				{ username: "bob", password: "bob", email: "bob@bob.com"},
				{ username: "jill", password: "jill", email: "jill@jill.com"},
				{ username: "molly", password: "molly", email: "molly@molly.com"},
			]
		  });
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
		//  reply.send({ users: users });
		
		// add viewing players table
		// const players = await request.server.prisma.player.findMany();
		//  reply.send({ users: users , players: players });
	
		// add viewing matches table
		const matches = await request.server.prisma.match.findMany();
		const formattedMatches = matches.map(formatDate);
		reply.send({ users: users, matches: formattedMatches });

		  	// reply with all tables
		// reply.send({ users: users, players: players, matches: matches });

	} catch (error) {
	  reply.status(500).send({ error: 'Failed to fetch users' });
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
