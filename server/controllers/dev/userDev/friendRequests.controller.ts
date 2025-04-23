import { FastifyRequest, FastifyReply } from 'fastify';

export const sendReq = async (request: FastifyRequest, reply: FastifyReply): Promise<any> => {
	try {
		const { sender, receiver } = request.params as { sender: string, receiver: string};

		console.log('Params: [', sender, '] [', receiver, ']');
		
		if (!sender || !receiver) {
			return reply.code(400).send({ error: "Missing sender or receiver in params" });
		}
		await request.server.prisma.friend.create({
			data: {
				status: 'PENDING',
				user1: { connect: { username: sender } },
				user2: { connect: { username: receiver } },
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
