import { FastifyRequest, FastifyReply } from 'fastify';
import { formatChatDate } from '../utils/dateUtils.controller';

export const getBlocked = async (request: FastifyRequest, reply: FastifyReply): Promise<any> => {
	try {
		const { userId } = request.params as { userId: Number };
		const user = Number(userId);
		const blocked = await getBlocked(user, request);
		reply.send({ blocked });
	} catch (error) {
	reply.status(500).send({ error: 'Failed to fetch blocked users' });
	}
	
};

// chat endpoints
//  fastify.post('createChat/:user1/:user2', createChat);
//  fastify.post('retrieveChat/:user1/:user2', retrieveChat);
//  fastify.post('updateChat/:user1/:user2', updateChat);
//  fastify.post('deleteChat/:user1/:user2', deleteChat);
//  fastify.post('blockedChat/:user1/:user2', blockedChat);