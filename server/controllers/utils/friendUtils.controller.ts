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
	// get the friend, not the user
	const friends = friendships.map(f => {
		const friendUser = f.user1Id === userId ? f.user2 : f.user1;
		return {
			friend: {
				username: friendUser.username,
				status: friendUser.status,
				wins: friendUser.wins,
				losses: friendUser.losses
			  },
			status: f.status,
			initiator: f.user1Id, // The user who sent the request
		};
	});
	return friends;
};

export async function getOnlyFriends(userId: number, request: FastifyRequest) {
	const friendships = await request.server.prisma.friend.findMany({
		where: {
			status: { in: ['FRIENDS'] },
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
	// get the friend, not the user
	const friends = friendships.map(f => {
		const friendUser = f.user1Id === userId ? f.user2 : f.user1;
		return {
			friend: {
				username: friendUser.username,
				status: friendUser.status,
			  },
			status: f.status,
			initiator: f.user1Id, // The user who sent the request
		};
	});
	return friends;
};
