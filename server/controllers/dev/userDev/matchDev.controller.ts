import { FastifyRequest, FastifyReply } from 'fastify';
import { formatMatchDate } from '../../utils/dateUtils.controller';
import { friendshipCheck } from '../../utils/friendUtils.controller';
import { getStats, updateWins, updateLosses } from '../../utils/matchUtils.controller';

export const makeMatchD = async (request: FastifyRequest, reply: FastifyReply): Promise<any> => {
	try {
		const { player1, player2 } = request.params as { player1: number, player2: number };
		const player1Id = Number(player1);
		const player2Id = Number(player2);

		await request.server.prisma.match.create({
			data: {
				player1: player1Id,
				player2: player2Id,
				status: 'INPROGRESS',
				date: new Date(),
			},
		});

		return reply.status(200).send({ message: 'Created match instance in database' });
	} catch (error) {
		return reply.status(500).send({ error: 'Failed to create match instance in database' });
	}
};

export const saveMatchD = async (request: FastifyRequest, reply: FastifyReply): Promise<any> => {
	try {
		const { match, won, lost } = request.params as { match: number, won: number, lost: number };
		const matchId = Number(match);
		const wonId = Number(won);
		const lostId = Number(lost);
		const scoreHigh = 11;
		const scoreLow = 3;
		
		await request.server.prisma.match.update({
			where: { id: Number(matchId),
				OR: [
					{ player1: wonId, player2: lostId },
					{ player1: lostId, player2: wonId }
				]
			 },
			data: {
				status: 'FINISHED',
				won: { connect: { id: wonId } },
				lost: { connect: { id: lostId } },
				highScore: scoreHigh,
				lowScore: scoreLow,
			},
		});
		await updateWins(wonId, request, reply);
		await updateLosses(lostId, request, reply);

		return reply.code(200).send({ message: "Successfully saved played match!" });
	} catch (error) {
		return reply.status(500).send({ error: 'Failed to save match in database' });
	}
};

// viewUserMatch
export const viewUserMatch = async (request: FastifyRequest, reply: FastifyReply): Promise<any> => {
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
		return reply.status(500).send({ error: 'Failed to view match history' });
	}
};

// viewWonMatch
export const viewWonMatch = async (request: FastifyRequest, reply: FastifyReply): Promise<any> => {
	try {
		const { userId } = request.params as { userId: number };
		const user = Number(userId);
		const matches = await request.server.prisma.match.findMany({
			where: { winner: user },
		});
		const formattedMatches = matches.map(formatMatchDate);
		return reply.send({ matches: formattedMatches });
	} catch(error) {
		return reply.status(500).send({ error: 'Failed to view match history' });
	}
};

// viewLostMatch
export const viewLostMatch = async (request: FastifyRequest, reply: FastifyReply): Promise<any> => {
	try {
		const { userId } = request.params as { userId: number };
		const user = Number(userId);
		const matches = await request.server.prisma.match.findMany({
			where: { loser: user },
		});
		const formattedMatches = matches.map(formatMatchDate);
		return reply.send({ matches: formattedMatches });
	} catch(error) {
		return reply.status(500).send({ error: 'Failed to view match history' });
	}
};

// viewFriendMatch
export const viewFriendMatch = async (request: FastifyRequest, reply: FastifyReply): Promise<any> => {
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
		reply.status(500).send({ error: 'Failed to view match history' });
	}
};

// viewFriendvsUser
export const viewFvsU = async (request: FastifyRequest, reply: FastifyReply): Promise<any> => {
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
		reply.status(500).send({ error: 'Failed to view match history' });
	}
};

