import { FastifyRequest, FastifyReply } from 'fastify';
import { formatMatchDate, formatMatchHistory } from '../utils/dateUtils.controller';
import { friendshipCheck } from '../utils/friendUtils.controller';
import { getStats, updateWins, updateLosses } from '../utils/matchUtils.controller';

export const makeMatch = async (request: FastifyRequest, reply: FastifyReply): Promise<any> => {
	try {
		const { player1, player2 } = request.params as { player1: number, player2: number };
		const player1Id = Number(player1);
		const player2Id = Number(player2);

		const match = await request.server.prisma.match.create({
			data: {
				player1: player1Id,
				player2: player2Id,
				status: 'INPROGRESS',
				date: new Date(),
			},
		});

		return reply.status(200).send({ message: 'Created match instance in database', matchId: match.id });
	} catch (error) {
		return reply.status(500).send({ error: 'Failed to create match instance in database' });
	}
};

/**
 * @brief update a match instance when match is finished and update users' statistics
 * 			in the user table of the database
 */
export const saveMatch = async (request: FastifyRequest, reply: FastifyReply): Promise<any> => {
	try {
		const { matchId, winnerId, loserId } = request.params as { matchId: number, winnerId: number, loserId: number };
		const body = request.body as { matchId: number, players: {winnerId: number, loserId: number}, tournament : boolean, highScore: number, lowScore: number};
		const scoreHigh = Number(highScore);
		const scoreLow = Number(lowScore);

		await request.server.prisma.match.update({
			where: { id: Number(matchId),
				OR: [
					{ player1: winnerId, player2: loserId },
					{ player1: loserId, player2: winnerId }
				]
			 },
			data: {
				status: 'FINISHED',
				won: { connect: { id: Number(winnerId) } },
				lost: { connect: { id: Number(loserId) } },
				tournament: body.tournament,
				highScore: scoreHigh,
				lowScore: scoreLow,
			},
		});
		await updateWins(winnerId, request, reply);
		await updateLosses(loserId, request, reply);

		return reply.code(200).send({ message: "Successfully saved played match!" });
	} catch (error) {
		return reply.status(500).send({ error: 'Failed to save match in database' });
	}
};

export const getInProgressMatches = async (request: FastifyRequest, reply: FastifyReply): Promise<any> => {
	try {
		const matches = await request.server.prisma.match.findMany({
			where: { status: 'INPROGRESS' },
		});
		const formattedMatches = matches.map(formatMatchDate);
		reply.status(200).send({ matches: formattedMatches, message: 'Successfully got \'in progress\' match instances' });
	} catch (error) {
		reply.status(500).send({ error: 'Failed to get \'in progress match\' instances' });
	}
};

// get users' tournament win count
export const getUserTourWins = async (request: FastifyRequest, reply: FastifyReply): Promise<any> => {
	try {
		const { userId } = request.params as { userId: number };
		const user = Number(userId);
		const matches = await request.server.prisma.match.findMany({
			where: {
				tournament: true,
				winner: user,
			}
		});
		const formattedMatches = matches.map(formatMatchDate);
		return reply.send({ matches: formattedMatches });
	} catch(error) {
		reply.status(500).send({ error: 'Failed to get users\' tournament win history' });
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
					{ loser: user },
				],
			},
			include: {
				won: {
					select: { username: true }
				},
				lost: {
					select: { username: true }
				},
			}
	});

		console.log("Logging matches: ", matches);
	// const requestSender = f.user1Id === userId ? f.user2 : f.user1;

	const formattedMatches = matches.map(match => formatMatchHistory(match, userId));
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
