import { FastifyRequest, FastifyReply } from 'fastify';
import { formatChatDate, formatMatchDate } from '../../utils/dateUtils.controller';
import { getAllFriends } from '../../utils/friendUtils.controller';

export async function populate(request: FastifyRequest, reply: FastifyReply) {
	try {
		await request.server.prisma.user.createMany({
			data: [
				{ username: "tim", password: "tim", email: "tim@tim.com"},
				{ username: "bill", password: "bill", email: "bill@bill.com"},
				{ username: "jill", password: "jill", email: "jill@jill.com"},
				{ username: "molly", password: "molly", email: "molly@molly.com"},
			]
		  });
		  const createdUsers = await request.server.prisma.user.findMany({
			where: {
			  username: { in: ["tim", "bill", "jill", "molly"] }
			}
		  });
		  await Promise.all(
			createdUsers.map(user =>
			  request.server.prisma.player.create({
				data: {
				  userId: user.id,
				  // set x, y etc
				}
			  })
			)
		  );
		
		return reply.send({ message: "populated user table with 4 users"});
		
	} catch (error) {
		return reply.code(500).send("Error populating user table");
	}
};

// export async function makefriends(request: FastifyRequest, reply: FastifyReply) {
// 	try {
// 		await request.server.prisma.user.createMany({
// 			data: [
// 				{ username: "tim", password: "tim", email: "tim@tim.com"},
// 				{ username: "bill", password: "bill", email: "bill@bill.com"},
// 				{ username: "jill", password: "jill", email: "jill@jill.com"},
// 				{ username: "molly", password: "molly", email: "molly@molly.com"},
// 			]
// 		  });
		
// 		  await request.server.prisma.friend.create({
// 			data: {
// 				status: 'PENDING',
// 				user1: { connect: { id: 1 } },
// 				user2: { connect: { id: 4 } },
// 				initiator: 1,
// 				blocker: 0,
// 			}

		
// 		return reply.send({ message: "populated user table with 4 users"});
		
// 	} catch (error) {
// 		return reply.code(500).send("Error populating user table");
// 	}
// };


export const viewDB = async (request: FastifyRequest, reply: FastifyReply): Promise<any> => {
	try {
	  const allUsers = await request.server.prisma.user.findMany();

	  const users = await Promise.all(allUsers.map(async user => {
		  const friends = await getAllFriends(user.id, request);
		  return { ...user, friends };
		}));

		const players = await request.server.prisma.player.findMany();
	
		const matches = await request.server.prisma.match.findMany();
		const formattedMatches = matches.map(formatMatchDate);

		reply.send({ users: users, players: players, matches: formattedMatches });

	} catch (error) {
	  return reply.status(500).send({ error: 'Failed to fetch users' });
	}
  };

  
  export const viewID = async (request: FastifyRequest, reply: FastifyReply): Promise<any> => {
	  try {
		  const { id } = request.params as { id: string };
		const user = await request.server.prisma.user.findUnique({ where: { id: parseInt(id, 10) } });
		reply.send(user);
	} catch (error) {
		reply.status(404).send({ error: 'Failed to fetch user via ID, user not found' });
	}
};


export const viewChat = async (request: FastifyRequest, reply: FastifyReply): Promise<any> => {
	try {
		const allUsers = await request.server.prisma.user.findMany();

		const users = await Promise.all(allUsers.map(async user => {
			const chats = await getAllChats(user.id, request);
			return { ...user, chats };
		}));



		reply.send({ users: users });

	} catch (error) {
		return reply.status(500).send({ error: 'Failed to fetch users' });
	}
	};

export async function getAllChats(userId: number, request: FastifyRequest) {
	const allChats = await request.server.prisma.chat.findMany({
		where: {
			OR: [
				{ user1Id: userId },
				{ user2Id: userId }
			]
		},
		include: {
			messages: true,
			user1: { select: { id: true, username: true } },
			user2: { select: { id: true, username: true } }
		}
	});
	const chats = allChats.map(chat => {
		const chatUser = chat.user1Id === userId ? chat.user2 : chat.user1;
		return {
			chatId: chat.id,
			withUser: {
				id: chatUser.id,
				username: chatUser.username,
			},
			messages: chat.messages
		};
	}); 
	return chats;

};
