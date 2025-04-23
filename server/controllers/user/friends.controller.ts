import { FastifyRequest, FastifyReply } from 'fastify';

// param: receiver is the person receiving THIS friend request from user
export const sendReq = async (request: FastifyRequest, reply: FastifyReply): Promise<any> => {
	try {
		const { receiverId } = request.params as { receiverId: number};
		const { userId } = request.body as { userId: number };
		const receiver = Number(receiverId);
		const user = Number(userId);

		if (!receiver) {
			return reply.code(400).send({ error: "Missing receiver in params" });
		}
		if (!user) {
			return reply.code(400).send({ error: "Missing user data" });
		}
		const existing = await request.server.prisma.friend.findFirst({
			where: {
				OR: [
					{ user1Id: user, user2Id: receiver },
					{ user1Id: receiver, user2Id: user }
				]
			}
		});
		if (existing) {
			return reply.code(409).send({ error: "Friendship request already exists" });
		}
		await request.server.prisma.friend.create({
			data: {
				status: 'PENDING',
				user1: { connect: { id: user } },
				user2: { connect: { id: receiver } },
				initiator: user,
			},
		});
		return reply.code(200).send({ message: "SENT FRIEND REQUEST"});
	} catch (error) {
		console.error(error);
		return reply.code(500).send({ error: "Failed to send friend request" });
	}
};

// param: sender is person who sent request, this user is accepting their request
export const acceptReq = async (request: FastifyRequest, reply: FastifyReply): Promise<any> => {
	try {
		const { senderId } = request.params as { senderId: number};
		const { userId } = request.body as { userId: number };
		const sender = Number(senderId);
		const user = Number(userId);

		if (!sender) {
			return reply.code(400).send({ error: "Missing sender in params" });
		}
		if (!user) {
			return reply.code(400).send({ error: "Missing user data" });
		}
		const initiator = await request.server.prisma.friend.findFirst({
			where: {
				status: 'PENDING',
				OR: [
					{ user1Id: user, user2Id: sender },
					{ user1Id: sender, user2Id: user }
				]
			}
		});
		if (!initiator)
			return reply.code(500).send({ error: " no pending request between these users found" });
		if (initiator.initiator === sender)
				return reply.code(406).send({ error: "Friend request sender can't accept their own request" });
		await request.server.prisma.friend.updateMany({
			where: {
				status: 'PENDING',
				OR: [
					{ user1Id: user, user2Id: sender },
					{ user1Id: sender, user2Id: user }
				]
			},
			data: {
				status: 'ACCEPTED',
			},
		});
		return reply.code(200).send({ message: "ACCEPTED FRIEND REQUEST SUCCESSFULLY"});
	} catch (error) {
		console.error(error);
		return reply.code(500).send({ error: "Failed to accept friend request" });
	}
};

// rejecter = person who received request and is now rejecting it - THIS PERSON CANT BE THE INITIATOR
// rejected = person who sent the request and is now receiving a rejection back
//export const rejectReq = async (request: FastifyRequest, reply: FastifyReply): Promise<any> => {
//	try {
//		const { rejecter, rejected } = request.params as { rejecter: string, rejected: string};
		
//		const initiator = await request.server.prisma.friend.findFirst({
//			where: {
//				status: 'PENDING',
//				OR: [
//					{ username1: rejecter, username2: rejected },
//					{ username1: rejected, username2: rejecter }
//				]
//			}
//		});
//		if (initiator.initiator === rejecter)
//				return reply.code(406).send({ error: "Friend request sender can't reject their own request" });
//		await request.server.prisma.friend.updateMany({
//			where: {
//				username1: rejecter,
//				username2: rejected,
//				status: 'PENDING',
//			},
//			data: {
//				status: 'REJECTED',
//			},
//		});
//		return reply.code(200).send({ message: "REJECTED FRIEND REQUEST SUCCESSFULLY"});
//	} catch (error) {
//		console.error(error);
//		return reply.code(500).send({ error: "Failed to reject friend request" });
//	}
//};
