import { FastifyRequest, FastifyReply } from 'fastify';

export async function getAllFriends(username: string, request: FastifyRequest) {
	const friendships = await request.server.prisma.friend.findMany({
		where: {
			status: { in: ['ACCEPTED', 'PENDING'] },
			OR: [
				{ username1: username},
				{ username2: username},
			],
		},
		include: {
			user1: true, 
			user2: true,
		},
	});
	// get the friend, not the user
	const friends = friendships.map(f => {
		const friendUser = f.username1 === username ? f.user2 : f.user1;
		return {
			friend: friendUser,
			status: f.status,
			initiator: f.username1, // The user who sent the request
		};
	});
	return friends;
};

export const viewDB = async (request: FastifyRequest, reply: FastifyReply): Promise<any> => {
	try {
	  const users = await request.server.prisma.user.findMany();
	//  const players = await request.server.prisma.player.findMany();

	  // for each user, get their friends:
	  const usersWithFriends = await Promise.all(users.map(async user => {
		const friends = await getAllFriends(user.username, request);
		return { ...user, friends };
	  }));

	  reply.send({ users: users, userFriends: usersWithFriends });
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
