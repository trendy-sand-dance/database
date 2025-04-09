**now**

1) test all EPs we got so far (inc avatar uploading + deleting)

2) rest of the um major module:
	◦ Users can add others as friends and view their online status.
	◦ User profiles display stats, such as wins and losses.
	◦ Each user has a Match History including 1v1 games, dates, and relevant details, accessible to logged-in users
	◦ securely login - password hashing

3) game endpoints in DB

4) swagger

5) postman



**needs to happen**

1) prisma migration / error things



**future+options**

1) maybe use: 		//if (error instanceof request.server.prisma.PrismaClientKnownRequestError) {
		//	if (error.code === 'P2002')
		//}

2) use the UserRequest thingy in types.d.ts




**remember**

 ! order of plugin registering is super important
- static then views
- dbconnector then routes

 ! must have both reply and request if using one of these, with only reply OR request, errors 



**completed**
- database module
- backend module
- most of the user management module