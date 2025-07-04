import { FastifyRequest, FastifyReply } from 'fastify';
import { getRequests, getFriends, getPending, getBlocked } from '../utils/friendUtils.controller';

// param: receiver is the person receiving THIS friend request from another user
export const sendFriendReq = async (request: FastifyRequest, reply: FastifyReply): Promise<any> => {
  try {
    const { receiverId, userId } = request.params as { receiverId: number, userId: number };
    const receiver = Number(receiverId);
    const user = Number(userId);

    if (!receiver) {
      return reply.code(400).send({ error: "Missing receiver in params" });
    }
    if (!user) {
      return reply.code(400).send({ error: "Missing user data" });
    }
    const existing = await request.server.prisma.friend.findFirst({
      where: {
        OR: [
          { user1Id: user, user2Id: receiver },
          { user1Id: receiver, user2Id: user }
        ]
      }
    });
    if (existing) {
      return reply.code(409).send({ error: "Friendship request already exists" });
    }
    await request.server.prisma.friend.create({
      data: {
        status: 'PENDING',
        user1: { connect: { id: user } },
        user2: { connect: { id: receiver } },
        initiator: user,
        blocker: 0,
      },
    });
    return reply.code(200).send({ message: "Successfully sent friend request" });
  } catch (error) {
    console.error(error);
    return reply.code(500).send({ error: "Failed to send friend request" });
  }
};

// param: sender is person who sent request, this user is accepting their request
export const acceptFriendReq = async (request: FastifyRequest, reply: FastifyReply): Promise<any> => {
  try {
    const { senderId, userId } = request.params as { senderId: number, userId: number };
    const sender = Number(senderId);
    const user = Number(userId);

    if (!sender) {
      return reply.code(400).send({ error: "Missing sender in params" });
    }
    if (!user) {
      return reply.code(400).send({ error: "Missing user data" });
    }
    const initiator = await request.server.prisma.friend.findFirst({
      where: {
        status: 'PENDING',
        OR: [
          { user1Id: user, user2Id: sender },
          { user1Id: sender, user2Id: user }
        ]
      }
    });
    if (!initiator)
      return reply.code(500).send({ error: "No pending request between these users found" });
    if (initiator.initiator === sender)
      return reply.code(406).send({ error: "Friend request sender can't accept their own request" });
    await request.server.prisma.friend.updateMany({
      where: {
        status: 'PENDING',
        OR: [
          { user1Id: user, user2Id: sender },
          { user1Id: sender, user2Id: user }
        ]
      },
      data: {
        status: 'FRIENDS',
      },
    });
    return reply.code(200).send({ message: "Sucessfully accepted friend request" });
  } catch (error) {
    console.error(error);
    return reply.code(500).send({ error: "Failed to accept friend request" });
  }
};

// param: sender is person who sent request, this user is rejecting their request
export const rejectFriendReq = async (request: FastifyRequest, reply: FastifyReply): Promise<any> => {
  try {
    const { senderId, userId } = request.params as { senderId: number, userId: number };
    const sender = Number(senderId);
    const user = Number(userId);

    if (!sender) {
      return reply.code(400).send({ error: "Missing sender in params" });
    }
    if (!user) {
      return reply.code(400).send({ error: "Missing user data" });
    }
    const initiator = await request.server.prisma.friend.findFirst({
      where: {
        status: 'PENDING',
        OR: [
          { user1Id: user, user2Id: sender },
          { user1Id: sender, user2Id: user }
        ]
      }
    });
    if (!initiator)
      return reply.code(500).send({ error: "No pending request between these users found" });
    if (initiator.initiator === sender)
      return reply.code(406).send({ error: "Friend request sender can't reject their own request" });
    await request.server.prisma.friend.deleteMany({
      where: {
        status: 'PENDING',
        OR: [
          { user1Id: user, user2Id: sender },
          { user1Id: sender, user2Id: user }
        ]
      }
    });
    return reply.code(200).send({ message: "Successfully rejected friend request" });
  } catch (error) {
    console.error(error);
    return reply.code(500).send({ error: "Failed to reject friend request" });
  }
};


export const blockFriend = async (request: FastifyRequest, reply: FastifyReply): Promise<any> => {
  try {
    const { friendId, userId } = request.params as { friendId: number, userId: number };
    const friend = Number(friendId);
    const user = Number(userId);

    if (!friend) {
      return reply.code(400).send({ error: "Missing friend in params" });
    }
    if (!user) {
      return reply.code(400).send({ error: "Missing user data" });
    }

    const existing = await request.server.prisma.friend.findFirst({
      where: {
        OR: [
          { user1Id: user, user2Id: friend },
          { user1Id: friend, user2Id: user }
        ]
      }
    });
    if (!existing) {
      return reply.code(409).send({ error: "No friendship found between these users" });
    }
    await request.server.prisma.friend.updateMany({
      where: {
        status: 'FRIENDS',
        OR: [
          { user1Id: user, user2Id: friend },
          { user1Id: friend, user2Id: user }
        ]
      },
      data: {
        status: 'BLOCKED',
        blocker: user,
      },
    });
    return reply.code(200).send({ message: "Successfully blocked friend" });

  } catch (error) {
    console.error(error);
    return reply.code(500).send({ error: "Failed to block friend" });
  }
};

export const blockPlayer = async (request: FastifyRequest, reply: FastifyReply): Promise<any> => {
  try {
    const { friendId, userId } = request.params as { friendId: number, userId: number };
    const friend = Number(friendId);
    const user = Number(userId);

    if (!friend) {
      return reply.code(400).send({ error: "Missing friend in params" });
    }
    if (!user) {
      return reply.code(400).send({ error: "Missing user data" });
    }

    const existing = await request.server.prisma.friend.findFirst({
      where: {
        OR: [
          { user1Id: user, user2Id: friend },
          { user1Id: friend, user2Id: user }
        ]
      }
    });
    if (!existing) {
      return reply.code(409).send({ error: "No friendship found between these users" });
    }
    await request.server.prisma.friend.updateMany({
      where: {
        OR: [
          { user1Id: user, user2Id: friend },
          { user1Id: friend, user2Id: user }
        ]
      },
      data: {
        status: 'BLOCKED',
        blocker: user,
      },
    });
    return reply.code(200).send({ message: "Successfully blocked friend" });

  } catch (error) {
    console.error(error);
    return reply.code(500).send({ error: "Failed to block friend" });
  }
};

export const unblockPlayer = async (request: FastifyRequest, reply: FastifyReply): Promise<any> => {
  try {
    const { friendId, userId } = request.params as { friendId: number, userId: number };
    const friend = Number(friendId);
    const user = Number(userId);

    if (!friend) {
      return reply.code(400).send({ error: "Missing friend in params" });
    }
    if (!user) {
      return reply.code(400).send({ error: "Missing user data" });
    }

    const existing = await request.server.prisma.friend.findFirst({
      where: {
        status: 'BLOCKED',
        OR: [
          { user1Id: user, user2Id: friend },
          { user1Id: friend, user2Id: user }
        ]
      }
    });
    if (!existing) {
      return reply.code(409).send({ error: "cant find blocked user" });
    }
    await request.server.prisma.friend.deleteMany({
      where: {
        status: 'BLOCKED',
        OR: [
          { user1Id: user, user2Id: friend },
          { user1Id: friend, user2Id: user }
        ]
      }
    });
    return reply.code(200).send({ message: "Successfully unblocked player" });

  } catch (error) {
    console.error(error);
    return reply.code(500).send({ error: "Failed to unblock player" });
  }
};

export const deleteAssociation = async (request: FastifyRequest, reply: FastifyReply): Promise<any> => {
  try {
    const { senderId, userId } = request.params as { senderId: number, userId: number };
    const sender = Number(senderId);
    const user = Number(userId);

    if (!sender) {
      return reply.code(400).send({ error: "Missing sender in params" });
    }
    const initiator = await request.server.prisma.friend.findFirst({
      where: {
        OR: [
          { user1Id: user, user2Id: sender },
          { user1Id: sender, user2Id: user }
        ]
      }
    });
    if (!initiator)
      return reply.code(500).send({ error: " no friendship between these users found" });
    // if (initiator.initiator === sender)
    // 		return reply.code(406).send({ error: "cant remove yourself, selflove brotha!" });
    await request.server.prisma.friend.deleteMany({
      where: {
        OR: [
          { user1Id: user, user2Id: sender },
          { user1Id: sender, user2Id: user }
        ]
      }
    });
    return reply.code(200).send({ log: "Friend entry deleted :)" });
  } catch (error) {
    console.error(error);
    return reply.code(500).send({ error: "Failed to delete entry" });
  }
};


export const areFriends = async (request: FastifyRequest, reply: FastifyReply): Promise<any> => {

  const ids = request.params as { userId1: number, userId2: number };

  try {

    const areFriends = await request.server.prisma.friend.findFirst({

      where: {
        OR: [
          {
            user1Id: Number(ids.userId1),
            user2Id: Number(ids.userId2),
          },
          {
            user1Id: Number(ids.userId2),
            user2Id: Number(ids.userId1),
          },
        ],
      },

    });

    // const status: string = areFriends.status;

    let status = null;
    if (areFriends)
      status = areFriends.status;

    reply.code(200).send({ friend: !!areFriends, status: status });
  } catch (error) {
	console.log(error);
    reply.status(500).send({ error: 'Failed to check if ids are friends' });
  }
};

export const viewPlayers = async (request: FastifyRequest, reply: FastifyReply): Promise<any> => {
	try {
		const { username } = request.params as { username: string };
		const user = await request.server.prisma.user.findUnique( {
			where: { username: username }
		});
		
		const requests = await getRequests(user.id, request);
		const friends = await getFriends(user.id, request);
		const pending = await getPending(user.id, request);
		const blocked = await getBlocked(user.id, request);
		const userId = user.id;
		
		reply.send({ requests, friends, pending, blocked, userId });
	} catch (error) {
		console.log(error);
		reply.status(500).send({ error: 'Failed to fetch players' });
	}
};


