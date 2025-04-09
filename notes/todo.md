
**now**

2) rest of the um major module:
	◦ Users can add others as friends and view their online status.
	◦ User profiles display stats, such as wins and losses.
	◦ Each user has a Match History including 1v1 games, dates, and relevant details, accessible to logged-in users
	◦ securely login - password hashing

22) game endpoints in DB

11) swagger

1) postman


4) prisma migration / error things





**future+options**

3) maybe: 		//if (error instanceof request.server.prisma.PrismaClientKnownRequestError) {
		//	if (error.code === 'P2002')
		//}

4) use the UserRequest thingy in types.d.ts




**remember**

 ! order of plugin registering is super important
- static then views
- dbconnector then routes

 ! must have both reply and request if using one of these, with only reply OR request, errors 



**completed**
- database module
- backend module
- most of the user management module

