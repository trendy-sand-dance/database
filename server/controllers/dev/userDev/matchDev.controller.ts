import { FastifyRequest, FastifyReply } from 'fastify';
import { updateWins, updateLosses } from "../../user/stats.controller";

// add matches
// check updates of user stats
// view matchs of user
// view matchs of users' friends / specific other player

export const makeMatch = async (request: FastifyRequest, reply: FastifyReply): Promise<any> => {
	try {
		const { won, lost } = request.params as { won: number, lost: number };
		const wonId = Number(won);
		const lostId = Number(lost);
		await request.server.prisma.match.create({
			data: {
				won: { connect: { id: wonId } },
				lost: { connect: { id: lostId } },
				//date: Date.now(),
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


export const viewMatches = async (request: FastifyRequest, reply: FastifyReply): Promise<any> => {
	try {
	  const matches = await request.server.prisma.match.findMany();

	  reply.send({ matches: matches });
	} catch (error) {
	  reply.status(500).send({ error: 'Failed to fetch match data' });
	}
  };
