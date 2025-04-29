import { FastifyRequest, FastifyReply } from 'fastify';

export async function getStats(request: FastifyRequest, reply: FastifyReply) {
	try {
		const { username } = request.params as { username: string };
		const user = await request.server.prisma.user.findUnique({
			where: { username },
			select: {
				wins: true, 
				losses: true,
			}
		});

	return reply.code(200).send(user);
	} catch (error) {
		reply.status(500).send({ error: 'Failed to fetch user statistics' });
	}
};

export async function updateWins(userId: number, request: FastifyRequest, reply: FastifyReply) {
	try {
		const userID = Number(userId);
		await request.server.prisma.user.update({
			where: { id: userID },
			data: { 
				wins: {
					increment: 1,
				}
			}
		});

	return reply.code(200).send({ message: "Successfully updated user win count" });
	} catch (error) {
		reply.status(500).send({ error: 'Failed to update user win count' });
	}
};

export async function updateLosses(userId: number, request: FastifyRequest, reply: FastifyReply) {
	try {
		const userID = Number(userId);
		await request.server.prisma.user.update({
			where: { id: userID },
			data: { 
				losses: {
					increment: 1,
				}
			}
		});

	return reply.code(200).send({ message: "Successfully updated user loss count" });
	} catch (error) {
		reply.status(500).send({ error: 'Failed to update user loss count' });
	}
};

/**
 * @brief add a match instance to database and update users' statistics
 * 			in the user table of the database
 */
export const saveMatch = async (request: FastifyRequest, reply: FastifyReply): Promise<any> => {
	try {
		const { won, lost } = request.params as { won: number, lost: number };
		const wonId = Number(won);
		const lostId = Number(lost);
		const date = "TODAY";
		console.log("make match between", wonId, " and ", lostId);
		await request.server.prisma.match.create({
			data: {
				user1Id: wonId,
				user2Id: lostId,
				won: { connect: { id: wonId } },
				lost: { connect: { id: lostId } },
				//date: date,
			},
		});
		console.log("created match entry");
		await updateWins(wonId, request, reply);
		await updateLosses(lostId, request, reply);
		console.log("updated user stats");
		return reply.code(200).send({ message: "Successfully saved played match!" });
	} catch (error) {
		reply.status(500).send({ error: 'Failed to save match in database' });
	}
};


// view users' total wins/losses

// view users' match history (all)

// view users' match history with specific user

