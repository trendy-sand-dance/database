import { FastifyRequest, FastifyReply } from 'fastify';

export const chatDev = async (request: FastifyRequest, reply: FastifyReply): Promise<any> => {
	try  {
		const { user1Id, user2Id } = request.params as { user1Id: number, user2Id: number };
		console.log("user 1 = ", user1Id, "user2Id = ", user2Id);
		const user1  = Number(user1Id);
		const user2  = Number(user2Id);

		const chat = await request.server.prisma.chat.create({
			data: {
				user1Id: user1,
				user2Id: user2,
				messages: {
					create: [
						{
							sent: "hello!", 
							date: new Date(),
						},
						{
							received: "hi there!", 
							date: new Date(),
						},
					],
				},
			},
		});
		return reply.status(200).send({ message: 'Created chat instance in database' }); // does someone want the chat ID or anything else?
	} catch (error) {
		return reply.status(500).send({ error: 'Failed to create chat instance in database' });
	}
};

