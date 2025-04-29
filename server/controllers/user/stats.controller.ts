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
		return reply.status(500).send({ error: 'Failed to fetch user statistics' });
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
		return reply.status(500).send({ error: 'Failed to update user win count' });
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
		return reply.status(500).send({ error: 'Failed to update user loss count' });
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

		await request.server.prisma.match.create({
			data: {
				won: { connect: { id: wonId } },
				lost: { connect: { id: lostId } },
				date: new Date(),
			},
		});

		await updateWins(wonId, request, reply);
		await updateLosses(lostId, request, reply);

		return reply.code(200).send({ message: "Successfully saved played match!" });
	} catch (error) {
		return reply.status(500).send({ error: 'Failed to save match in database' });
	}
};



// view users' match history (all)

// view users' wins

// view users' losses

// view users' friend match history 

// view users' specific match history with <friend> 

