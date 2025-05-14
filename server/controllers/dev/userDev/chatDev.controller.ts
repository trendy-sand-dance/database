import { FastifyRequest, FastifyReply } from 'fastify';
import { formatChatDate } from '../../utils/dateUtils.controller';

export const chatDev = async (request: FastifyRequest, reply: FastifyReply): Promise<any> => {
	try  {
		const { user1Id, user2Id } = request.params as { user1Id: number, user2Id: number };
		console.log("user 1 = ", user1Id, "user2Id = ", user2Id);
		const user1  = Number(user1Id);
		const user2  = Number(user2Id);

		const chat = await request.server.prisma.chat.create({
			data: {
				user1Id: user1,
				user2Id: user2,
				user: { connect: { id: Number(user1) } },
			},
		});
		return reply.status(200).send({ message: 'Created char instance in database' }); // does someone want the chat ID or anything else?
	} catch (error) {
		return reply.status(500).send({ error: 'Failed to create chat instance in database' });
	}
};

//export async function getAllChats(userId: number, request: FastifyRequest) {
//	const allChats = await request.server.prisma.chat.findMany({
//		where: {
//			user1Id: userId,
//		},
//	});
////	const chats = allChats.map(f => {
////		const chatUser = f.user1Id === userId ? f.user2 : f.user1;
////		return {
////			chat: {
////				username: userId.username,
////				status: friendUser.status,
////				id: friendUser.id,
////			  },
////			status: f.status,
////			initiator: f.user1Id,
////		};
////	});
////	return chats;

//	return allChats;
//};