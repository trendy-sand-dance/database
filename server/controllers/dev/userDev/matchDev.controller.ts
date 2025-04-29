import { FastifyRequest, FastifyReply } from 'fastify';
//import { saveMatch } from "../../user/stats.controller";

// add matches
// check updates of user stats
// view matchs of user
// view matchs of users' friends / specific other player

//export const addMatch = async ( request: FastifyRequest, reply: FastifyReply): Promise<any> => {
//	try {
//		const winnerId = 1;
//		const loserId = 2;
//		request.params = { won: winnerId, lost: loserId };
//		const response = await saveMatch(request, reply);
//		return reply.code(200).send({ message: " created match entry between players 1 and 2"});

//	} catch (error) {
//		reply.status(500).send({ error: 'Failed to create match entry in db' });
//	}
//};

export const viewMatches = async (request: FastifyRequest, reply: FastifyReply): Promise<any> => {
	try {
	  const matches = await request.server.prisma.match.findMany();

	  reply.send({ matches: matches });
	} catch (error) {
	  reply.status(500).send({ error: 'Failed to fetch match data' });
	}
  };
