import { FastifyRequest, FastifyReply } from 'fastify';

export async function hasBeenBlocked(user: number, request: FastifyRequest) {
	const whoBlockedMe = await request.server.prisma.friend.findMany({
		where: {
			status: { in: ['BLOCKED'] },
			blocker: { not: user },
			OR: [
				{ user1Id: user},
				{ user2Id: user},
			],
		},
		include: {
			user1: true, 
			user2: true,
		},
	});
	const beenBlocked = whoBlockedMe.map(f => {
		const blocked = f.user1Id === user ? f.user2 : f.user1;
		return {
				id: blocked.id,
		};
	});
	return beenBlocked;
};

export async function getBlockedIds(user: number, request: FastifyRequest) {
	const blocked = await request.server.prisma.friend.findMany({
		where: {
			status: { in: ['BLOCKED'] },
			blocker: user,
			OR: [
				{ user1Id: user},
				{ user2Id: user},
			],
		},
		include: {
			user1: true, 
			user2: true,
		},
	});
	const blockedPlayers = blocked.map(f => {
		const blockedUser = f.user1Id === user ? f.user2 : f.user1;
		return {
				id: blockedUser.id,
		};
	});
	return blockedPlayers;
};

export const getBlocked = async (request: FastifyRequest, reply: FastifyReply): Promise<any> => {
	try {
		const { userId } = request.params as { userId: number };
		const user = Number(userId);
		const blocked = await getBlockedIds(user, request);
		const blocks = await hasBeenBlocked(user, request);
		const allBlocks = [
			...blocked.map(p => p.id),
			...blocks.map(p => p.id)
		];
		return reply.send(allBlocks);
	} catch (error) {
		console.log(error);
		return reply.status(500).send({ error: 'Failed to fetch id\'s of blocked users' });
	}
};
 
export const getBlocks = async (request: FastifyRequest, reply: FastifyReply): Promise<any> => {
	try {
		const { userId } = request.params as { userId: number };
		const user = Number(userId);
		const blocks = await hasBeenBlocked(user, request);
		return reply.send(blocks.map(p => p.id));
	} catch (error) {
		console.log(error);
		return reply.status(500).send({ error: 'Failed to fetch id\'s of users who have blocked you' });
	}
};
