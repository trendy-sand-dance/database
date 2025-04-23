npx prisma migrate dev --name init --schema=./prisma/schema.prisma


questions + shit i dont understand about prisma:

1) is it correct that i create a database (new Database), decorate fastify with it and then call prisma which somehow connects to db and queries it?
	do i connect before or after prisma decoration?

2) what is prisma generate?

3) what is prisma migrate?

4) what are the basic things i need to use and query the db?

5) how to communicate with prisma via another container (um)?

6) db url in .env?


can use: FastifyRequest<{ Body: FastifyReply.UserRequest }>



FRIENDS:

compare userId with friendId to ensure user can only 
befriend another user once.

does it make sense for a user to have friends ?
or a friend is an object with some info in the db schema
their is a friendId ... not sure about this

USER_RELATIONSHIP {
    user_first_id,
    user_second_id,
    type

    primary key(user_first_id, user_second_id)
}
Ensure: user_first_id < user_second_id

The most interesting part - type: for all of the possible states of a relationship, you create the corresponding values. For exmaple:

pending_first_second
pending_second_first
friends
block_first_second
block_second_first
block_both


REMEMBER

- !! userId1 < userId2
- if one type bool changes, the other true must become false



// Friend? - if no friends, then model is empty


  @@unique([username, password]) // primary key
  	@@id([userId]) // primary key
	//no_relation				Boolean		@default(1)


// unfriended = deleted, so friend object doesnt exist anymore anyway


------------------------------------------------------------------------

// This is your Prisma schema file,
// learn more about it in the docs: https://pris.ly/d/prisma-schema

// Looking for ways to speed up your queries, or scale easily with your serverless or edge functions?
// Try Prisma Accelerate: https://pris.ly/cli/accelerate-init

// output   = "app/generated/prisma/client"

// todo better way to have positions (x,y) as one element?

datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

model User {
  id    			Int     @id @default(autoincrement())
  username  		String     @unique
  password 			String
  email 			String     @unique
  avatar 			String		@default("img_avatar.png")
  status 			Boolean     @default(false)  
  wins				Int @default(0)
  losses 			Int @default(0)

  player 			Player?
  friends 			Friend[]
}

model Player {
    id            Int   @id @default(autoincrement())
    userId        Int     @unique
    x             Int @default(0)
    y             Int @default(0)

    user          User   @relation(fields: [userId], references: [id])
}

model Friend {
    id    		    Int 	 @unique
	userId			Int      @unique
	status		    Type	 @default(NO_RELATION)

	user     		User	@relation(fields: [userId], references: [id])
}

enum Type {
	NO_RELATION
	SENT
	RECEIVED
	ACCEPTED
	REJECTED
	BLOCKED
}