npx prisma migrate dev --name init --schema=./prisma/schema.prisma


questions + shit i dont understand about prisma:

1) is it correct that i create a database (new Database), decorate fastify with it and then call prisma which somehow connects to db and queries it?
	do i connect before or after prisma decoration?

2) what is prisma generate?

3) what is prisma migrate?

4) what are the basic things i need to use and query the db?

5) how to communicate with prisma via another container (um)?

6) db url in .env?