import { FastifyRequest, FastifyReply } from 'fastify';

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

export async function getAllFriends(userId: number, request: FastifyRequest) {
	const friendships = await request.server.prisma.friend.findMany({
		where: {
			status: { in: ['FRIENDS', 'PENDING', 'BLOCKED'] },
			OR: [
				{ user1Id: userId},
				{ user2Id: userId},
			],
		},
		include: {
			user1: true, 
			user2: true,
		},
	});
	const friends = friendships.map(f => {
		const friendUser = f.user1Id === userId ? f.user2 : f.user1;
		return {
			friend: {
				username: friendUser.username,
				status: friendUser.status,
			  },
			status: f.status,
			initiator: f.user1Id,
		};
	});
	return friends;
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
		  reply.send({ users: users, matches: matches });

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
