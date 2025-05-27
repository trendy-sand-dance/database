import { FastifyRequest, FastifyReply } from 'fastify';
import { formatChatDate } from '../utils/dateUtils.controller';

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
		return reply.send({ blocked });
	} catch (error) {
		return reply.status(500).send({ error: 'Failed to fetch id\'s of blocked users' });
	}
};

// chat endpoints
//  fastify.post('createChat/:user1/:user2', createChat);
//  fastify.post('retrieveChat/:user1/:user2', retrieveChat);
//  fastify.post('updateChat/:user1/:user2', updateChat);
//  fastify.post('deleteChat/:user1/:user2', deleteChat);
//  fastify.post('blockedChat/:user1/:user2', blockedChat);