import { FastifyRequest, FastifyReply } from 'fastify';
import { formatChatDate, formatMatchDate } from '../../utils/dateUtils.controller';
import { getAllFriends } from '../../utils/friendUtils.controller';

export async function populate(request: FastifyRequest, reply: FastifyReply) {
	try {
		await request.server.prisma.user.createMany({
			data: [
				{ username: "dan", password: "dan", email: "dan@dan.com"},
				{ username: "pat", password: "pat", email: "pat@pat.com"},
				{ username: "pip", password: "pip", email: "pip@pip.com"},
				{ username: "tom", password: "tom", email: "tom@tom.com"},
			]
		  });
		  const createdUsers = await request.server.prisma.user.findMany({
			orderBy: {
				id: 'asc'
			},
			where: {
			  username: { in: ["dan", "pat", "pip", "tom"] },
			}
		  });
		  await Promise.all(
			createdUsers.map(user =>
			  request.server.prisma.player.create({
				data: {
				  id: user.id,
				  userId: user.id,
				//   set x, y etc
				}
			  })
			)
		  );
		
		return reply.send({ message: "populated user table with 4 users"});
		
	} catch (error) {
		console.log(error);
		return reply.code(500).send("Error populating user table");
	}
};

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
		console.log(error);
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
			messages: {
				orderBy: {timestamp: 'asc'},
				include: {
					sender: { select: { id: true, username: true } },
					receiver: { select: { id: true, username: true } },
				} 
			},
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
			messages: chat.messages.map(msg => ({
				id: msg.id,
				text: msg.text,
				timestamp: msg.timestamp,
				sender: msg.sender,
				receiver: msg.receiver,
			})),
		};
	}); 
	return chats;
};
