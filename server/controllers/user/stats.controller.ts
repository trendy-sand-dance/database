import { FastifyRequest, FastifyReply } from 'fastify';
import { formatMatchDate } from '../utils/matchUtils.controller';
import { friendshipCheck } from '../utils/friendUtils.controller';

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

	return reply.code(200).send(user); // check when/how this is being used and therefore what to return
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
		reply.code(200);
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
		reply.code(200);
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

// get users' match history (all)
export const getUserMatches = async (request: FastifyRequest, reply: FastifyReply): Promise<any> => {
	try {
		const { userId } = request.params as { userId: number };
		const user = Number(userId);
		const matches = await request.server.prisma.match.findMany({
			where: {
				OR: [
					{ winner: user },
					{ loser: user }
				]
			}
		});
		const formattedMatches = matches.map(formatMatchDate);
		return reply.send({ matches: formattedMatches });
	} catch(error) {
		reply.status(500).send({ error: 'Failed to get users\' match history' });
	}
};

// get users' wins
export const getWonMatches = async (request: FastifyRequest, reply: FastifyReply): Promise<any> => {
	try {
		const { userId } = request.params as { userId: number };
		const user = Number(userId);
		const matches = await request.server.prisma.match.findMany({
			where: { winner: user },
		});
		const formattedMatches = matches.map(formatMatchDate);
		return reply.send({ matches: formattedMatches });
	} catch(error) {
		reply.status(500).send({ error: 'Failed to get users\' won match history' });
	}
};

// get users' losses
export const getLostMatches = async (request: FastifyRequest, reply: FastifyReply): Promise<any> => {
	try {
		const { userId } = request.params as { userId: number };
		const user = Number(userId);
		const matches = await request.server.prisma.match.findMany({
			where: { loser: user },
		});
		const formattedMatches = matches.map(formatMatchDate);
		return reply.send({ matches: formattedMatches });
	} catch(error) {
		reply.status(500).send({ error: 'Failed to get users\' lost match history' });
	}
};

// get users' friend match history
export const getFriendMatches = async (request: FastifyRequest, reply: FastifyReply): Promise<any> => {
	try {
		const { userId, friendId } = request.params as { userId: number, friendId: number };
		const user = Number(userId);
		const friend = Number(friendId);
		const friendCheck = await friendshipCheck(user, friend, request, reply);
		if (!friendCheck)
			return reply.code(404).send({ error: "no friendship found" });
		const matches = await request.server.prisma.match.findMany({
			where: {
				OR: [
					{ winner: friend },
					{ loser: friend }
				]
			}
		});
		const formattedMatches = matches.map(formatMatchDate);
		return reply.send({ matches: formattedMatches });
	} catch(error) {
		reply.status(500).send({ error: 'Failed to get users\' friends\' match history' });
	}
};

// get users' specific match history with <friend>
export const getFriendvsUser = async (request: FastifyRequest, reply: FastifyReply): Promise<any> => {
	try {
		const { userId, friendId } = request.params as { userId: number, friendId: number };
		const user = Number(userId);
		const friend = Number(friendId);
		const friendCheck = await friendshipCheck(user, friend, request, reply);
		if (!friendCheck)
			return reply.code(404).send({ error: "no friendship found" });
		const matches = await request.server.prisma.match.findMany({
			where: {
				OR: [
					{ winner: friend, loser: user },
					{ loser: friend, winner: user }
				]
			}
		});
		const formattedMatches = matches.map(formatMatchDate);
		return reply.send({ matches: formattedMatches });
	} catch(error) {
		reply.status(500).send({ error: 'Failed to get match history of user vs friend' });
	}
};
