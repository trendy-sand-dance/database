
**now**

1)  pass the error code and message from user management to frontend (aka not hardcoded in frontend)

	fix this from frontend in um/db: 
		if (response.status === 500)
				throw ({code: response.status, message: "Internal Server Error"});
		else if (response.status === 406)
			throw ({code: response.status, message: "(Not acceptable) Invalid Credentials"});
		else if (response.status === 200) {
			return reply.viewAsync("dashboard/dashboard-view.ejs", { username: userInfo.username});
		}

		if !200
			throw (with code + message sepcifications)
		return dash view with good status



4) prisma migration / error things

2) rest of the um major module:
	◦ Users can add others as friends and view their online status.
	◦ User profiles display stats, such as wins and losses.
	◦ Each user has a Match History including 1v1 games, dates, and relevant details, accessible to logged-in users

3) securely login - password hashing


--- if 2 + 3 complete, usermanagement is basically done



**future+options**

3) maybe: 		//if (error instanceof request.server.prisma.PrismaClientKnownRequestError) {
		//	if (error.code === 'P2002')
		//}

4) use the UserRequest thingy in types.d.ts

11) swagger

1) postman



**remember**

 ! order of plugin registering is super important
- static then views
- dbconnector then routes

 ! must have both reply and request if using one of these, with only reply OR request, errors 



**completed**
- database module
- backend module
- most of the user management module

