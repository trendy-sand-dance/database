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
				status: friendUser.status,
		};
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
		};
	});
	return blockedPlayers;
};

// wins/losses floating window endpoint using getstats controller

// blocked middleware controller, add to controllers involvling displaying players info/sending messages
// if user is blocked by player, dont go ahead with getting player info/allowing chatting
/**
 * 
 * @brief userId = user who is logged in
 * 			targetId = player that may have blocked current user
 * 			if targetId has blocked this user, this user doesn't have all funcationality
 * 			with regards to the targetId player
 */
//async function blockCheckMiddleware(req, res, next) {
//	const userId = req.user.id;
//	const playerId = req.body.targetUserId;
  
//	const isBlocked = await BlockedUsers.exists({
//	  where: [
//		{ blocker_id: currentUserId, blocked_id: targetUserId },
//		{ blocker_id: targetUserId, blocked_id: currentUserId }
//	  ]
//	});
  
//	if (isBlocked) {
//	  return res.status(403).json({ message: "Action not allowed." });
//	}
//	next();
//  }