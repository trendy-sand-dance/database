import { FastifyRequest, FastifyReply } from 'fastify';

export async function getRequests(userId: number, request: FastifyRequest) {
	const pendingRequests = await request.server.prisma.friend.findMany({
		where: {
			status: { in: ['PENDING'] },
			OR: [
				{ user1Id: userId},
				{ user2Id: userId},
			],
			NOT: {
				initiator: userId,
			},
		},
		include: {
			user1: true, 
			user2: true,
		},
	});
	const requests = pendingRequests.map(f => {
		const requestSender = f.user1Id === userId ? f.user2 : f.user1;
		return {
				avatar: requestSender.avatar,
				username: requestSender.username,
				id: requestSender.id,
		};
	});
	return requests;
};

export async function getFriends(userId: number, request: FastifyRequest) {
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
	const friends = friendships.map(f => {
		const friendUser = f.user1Id === userId ? f.user2 : f.user1;
		return {
				avatar: friendUser.avatar,
				username: friendUser.username,
				id: friendUser.id,
				status: friendUser.status,
				wins: friendUser.wins,
				losses: friendUser.losses,
		};
	});

	// Sort by online (status: true) first, then offline (status: false)
	friends.sort((a, b) => {
		return (b.status ? 1 : 0) - (a.status ? 1 : 0);
	});
	return friends;
};

export async function getPending(userId: number, request: FastifyRequest) {
	const pendingRequests = await request.server.prisma.friend.findMany({
		where: {
			status: { in: ['PENDING'] },
			initiator: userId,
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
	const requested = pendingRequests.map(f => {
		const requestedFriends = f.user1Id === userId ? f.user2 : f.user1;
		return {
				avatar: requestedFriends.avatar,
				username: requestedFriends.username,
				id: requestedFriends.id,
		};
	});
	return requested;
};

export async function getBlocked(userId: number, request: FastifyRequest) {
	const blocked = await request.server.prisma.friend.findMany({
		where: {
			status: { in: ['BLOCKED'] },
			blocker: userId,
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
	const blockedPlayers = blocked.map(f => {
		const blockedUser = f.user1Id === userId ? f.user2 : f.user1;
		return {
			avatar: blockedUser.avatar,
				username: blockedUser.username,
				id: blockedUser.id,
		};
	});
	return blockedPlayers;
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
				id: friendUser.id,
			  },
			status: f.status,
			initiator: f.user1Id,
		};
	});
	return friends;
};

export async function friendshipCheck(userId: number, friendId: number, request: FastifyRequest, reply: FastifyReply) { 
	const friendship = await request.server.prisma.friend.findFirst({
		where: {
			status: 'FRIENDS',
			OR: [
				{ user1Id: userId, user2Id: friendId },
				{ user1Id: friendId, user2Id: userId }
			]
		},
	});
	return friendship;
};

export async function areWeBlocked(request: FastifyRequest, reply: FastifyReply) { 
	const { userId, playerId } = request.params as { userId: number, playerId: number };
	const user = Number(userId);
	const player = Number(playerId);
	const blocked = await request.server.prisma.friend.findFirst({
		where: {
			status: 'BLOCKED',
			OR: [
				{ user1Id: user, user2Id: player },
				{ user1Id: player, user2Id: user }
			]	
		},	
	});
	if (!blocked)
		return reply.code(200).send({ message: "no blockage found" });
	else if (blocked.blocker === user)
		return reply.code(200).send({ message: "you have blocked this player" });
	else if (blocked.blocker === player)
		return reply.code(200).send({ message: "unable to chat with this player" });
};
