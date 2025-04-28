import { FastifyRequest, FastifyReply } from 'fastify';
//import { getAllFriends, getOnlyFriends } from '../../utils/friendUtils.controller';


// param: receiver is the person receiving THIS friend request from user
export const sendReqDev = async (request: FastifyRequest, reply: FastifyReply): Promise<any> => {
	try {
		const { receiverId, userId } = request.params as { receiverId: number, userId: number};

		
		const receiver = Number(receiverId);
		const user = Number(userId);

		if (!receiver) {
			return reply.code(400).send({ error: "Missing receiver in params" });
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
export const acceptReqDev = async (request: FastifyRequest, reply: FastifyReply): Promise<any> => {
	try {
		const { senderId, userId } = request.params as { senderId: number, userId: number };
		
		const sender = Number(senderId);
		const user = Number(userId);

		if (!sender) {
			return reply.code(400).send({ error: "Missing sender in params" });
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
		if (initiator.initiator === user)
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
				status: 'FRIENDS',
			},
		});
		return reply.code(200).send({ message: "ACCEPTED FRIEND REQUEST SUCCESSFULLY"});
	} catch (error) {
		console.error(error);
		return reply.code(500).send({ error: "Failed to accept friend request" });
	}
};

// param: sender is person who sent request, this user is rejecting their request
export const rejectReqDev = async (request: FastifyRequest, reply: FastifyReply): Promise<any> => {
	try {
		const { senderId, userId } = request.params as { senderId: number, userId: number};
		const sender = Number(senderId);
		const user = Number(userId);

		if (!sender) {
			return reply.code(400).send({ error: "Missing sender in params" });
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
				return reply.code(406).send({ error: "Friend request sender can't reject their own request" });
		await request.server.prisma.friend.deleteMany({
			where: {
				status: 'PENDING',
				OR: [
					{ user1Id: user, user2Id: sender },
					{ user1Id: sender, user2Id: user }
				]
			}
		});
		return reply.code(200).send({ message: "FRIEND REQUEST REJECTED SUCCESSFULLY"});
	} catch (error) {
		console.error(error);
		return reply.code(500).send({ error: "Failed to reject friend request" });
	}
};

//export const viewAllFriendsDev = async (request: FastifyRequest, reply: FastifyReply): Promise<any> => {
//	try {
//		const { username } = request.params as { username: string };
//		const user = await request.server.prisma.user.findUnique( {
//			where: { username: username }
//		});

//		const friends = await getAllFriends(user.id, request);

//		reply.send({ friends });
//	} catch (error) {
//		reply.status(500).send({ error: 'Failed to fetch user friends' });
//	}
//};

//export const viewOnlyFriendsDev = async (request: FastifyRequest, reply: FastifyReply): Promise<any> => {
//	try {
//		const { username } = request.params as { username: string };
//		const user = await request.server.prisma.user.findUnique( {
//			where: { username: username }
//		});

//		const friends = await getOnlyFriends(user.id, request);

//		reply.send({ friends });
//	} catch (error) {
//		reply.status(500).send({ error: 'Failed to fetch user friends' });
//	}
//};
