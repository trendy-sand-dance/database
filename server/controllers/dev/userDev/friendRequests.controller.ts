import { FastifyRequest, FastifyReply } from 'fastify';

export const sendReq = async (request: FastifyRequest, reply: FastifyReply): Promise<any> => {
	try {
		const { sender, receiver } = request.params as { sender: string, receiver: string};
		
		if (!sender || !receiver) {
			return reply.code(400).send({ error: "Missing sender or receiver in params" });
		}
		const existing = await request.server.prisma.friend.findFirst({
			where: {
				OR: [
					{ username1: sender, username2: receiver },
					{ username1: receiver, username2: sender }
				]
			}
		});
		if (existing) {
			return reply.code(409).send({ error: "Friendship request already exists" });
		}
		await request.server.prisma.friend.create({
			data: {
				status: 'PENDING',
				user1: { connect: { username: sender } },
				user2: { connect: { username: receiver } },
				initiator: sender,
			},
		});
		return reply.code(200).send({ message: "SENT FRIEND REQUEST"});
	} catch (error) {
		console.error(error);
		return reply.code(500).send({ error: "Failed to send friend request" });
	}
};

export const acceptReq = async (request: FastifyRequest, reply: FastifyReply): Promise<any> => {
	try {
		const { sender, receiver } = request.params as { sender: string, receiver: string};
		//if () if sender is user, dont allow accept
		// if user is the receiver not the sender
		//if (receiver ===  request.server.prisma.friend.)
		const initiator = await request.server.prisma.friend.findFirst({
			where: {
				status: 'PENDING',
				OR: [
					{ username1: sender, username2: receiver },
					{ username1: receiver, username2: sender }
				]
			}
		});
		if (initiator === sender)
				return reply.code(406).send({ error: "Friend request sender can't accept their own request" });
		await request.server.prisma.friend.updateMany({
			where: {
				username1: sender,
				username2: receiver,
				status: 'PENDING',
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

export const rejectReq = async (request: FastifyRequest, reply: FastifyReply): Promise<any> => {
	try {
		const { sender, receiver } = request.params as { sender: string, receiver: string};
		//if () if sender is user, dont allow reject
		
		await request.server.prisma.friend.updateMany({
			where: {
				username1: sender,
				username2: receiver,
				status: 'PENDING',
			},
			data: {
				status: 'REJECTED',
			},
		});
		return reply.code(200).send({ message: "REJECTED FRIEND REQUEST SUCCESSFULLY"});
	} catch (error) {
		console.error(error);
		return reply.code(500).send({ error: "Failed to reject friend request" });
	}
};
