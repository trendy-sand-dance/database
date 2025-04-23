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

// accepter = person who received request and is now accepting it - THIS PERSON CANT BE THE INITIATOR
// acceptee = person who sent the request and is now receiving an accept back
export const acceptReq = async (request: FastifyRequest, reply: FastifyReply): Promise<any> => {
	try {
		const { accepter, acceptee } = request.params as { accepter: string, acceptee: string};

		const initiator = await request.server.prisma.friend.findFirst({
			where: {
				//status: 'PENDING',
				OR: [
					{ username1: accepter, username2: acceptee },
					{ username1: acceptee, username2: accepter }
				]
			}
		});
		if (!initiator)
			console.log("no initiator")
		if (initiator)
			console.log("initiator found");
			console.log("initiator found = ", initiator, initiator.initiator);
		if (initiator.initiator === accepter)
				return reply.code(406).send({ error: "Friend request sender can't accept their own request" });
		await request.server.prisma.friend.updateMany({
			where: {
				username1: accepter,
				username2: acceptee,
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

// rejecter = person who received request and is now rejecting it - THIS PERSON CANT BE THE INITIATOR
// rejected = person who sent the request and is now receiving a rejection back
export const rejectReq = async (request: FastifyRequest, reply: FastifyReply): Promise<any> => {
	try {
		const { rejecter, rejected } = request.params as { rejecter: string, rejected: string};
		
		const initiator = await request.server.prisma.friend.findFirst({
			where: {
				status: 'PENDING',
				OR: [
					{ username1: rejecter, username2: rejected },
					{ username1: rejected, username2: rejecter }
				]
			}
		});
		if (initiator.initiator === rejecter)
				return reply.code(406).send({ error: "Friend request sender can't reject their own request" });
		await request.server.prisma.friend.updateMany({
			where: {
				username1: rejecter,
				username2: rejected,
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
