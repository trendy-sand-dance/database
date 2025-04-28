import { FastifyRequest, FastifyReply } from 'fastify';

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
	  // const players = await request.server.prisma.player.findMany();
	  const users = await Promise.all(allUsers.map(async user => {
		const friends = await getAllFriends(user.id, request);
		return { ...user, friends };
	  }));

	  reply.send({ users: users });
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
