import { FastifyRequest, FastifyReply } from 'fastify';
import { updateWins, updateLosses } from "../../user/stats.controller";

// add matches
// check updates of user stats
// view matchs of user
// view matchs of users' friends / specific other player

// figure date stuff out
//const date = new Date(request.server.prisma.match.date);
//const formatted = date.toLocaleDateString('en-GB');


export const makeMatch = async (request: FastifyRequest, reply: FastifyReply): Promise<any> => {
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
