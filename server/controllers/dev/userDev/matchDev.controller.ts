import { FastifyRequest, FastifyReply } from 'fastify';
import { updateWins, updateLosses } from "../../user/stats.controller";

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


// viewUserMatch
export const viewUserMatch = async (request: FastifyRequest, reply: FastifyReply): Promise<any> => {
	try {

	} catch {
		reply.status(500).send({ error: 'Failed to view match history' });
	}
};

// viewWonMatch
export const viewWonMatch = async (request: FastifyRequest, reply: FastifyReply): Promise<any> => {
	try {

	} catch {
		reply.status(500).send({ error: 'Failed to view match history' });
	}
};

// viewLostMatch
export const viewLostMatch = async (request: FastifyRequest, reply: FastifyReply): Promise<any> => {
	try {

	} catch {
		reply.status(500).send({ error: 'Failed to view match history' });
	}
};

// viewFriendMatch
export const viewFriendMatch = async (request: FastifyRequest, reply: FastifyReply): Promise<any> => {
	try {

	} catch {
		reply.status(500).send({ error: 'Failed to view match history' });
	}
};

// viewFriendvsUser
export const viewFvsU = async (request: FastifyRequest, reply: FastifyReply): Promise<any> => {
	try {

	} catch {
		reply.status(500).send({ error: 'Failed to view match history' });
	}
};

