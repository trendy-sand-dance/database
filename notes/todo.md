

**now working on (backend database/usermanagement)** 

12) prisma:
	- used in database and user containers, so added as packages to both
	- need decent version of  node.js to get prisma in package-lock.json

Conside this option:

4. Alternative: Use a Shared Prisma Client Package
If both repos use Prisma, consider creating a shared package that contains the prisma client and import it in both projects.

Example:
Create a separate repo (prisma-client) with just the Prisma schema and client. Then install it as a dependency in both projects:

sh
Copy
Edit
npm install git+ssh://git@github.com:your-org/prisma-client.git
Now both projects use the same Prisma client without duplicating schema files.




11) swagger
1) postman
3) squash + merge + rebase + joope dev ops, source stuff etc etc
4) sharing/sending/storing variables between back + front
	4.1) schemas - what for and where will they be- lets figure that out together? 




**team**


**remember**

 ! order of plugin registering is super important
- static then views
- dbconnector then routes

 ! must have both reply and request if using one of these, with only reply OR request, errors 

 ! ? database queries, ? these avtually matter, the amount of them needs to match the values given in the run() that comes after




logging in ->

 frontend-1          | [1]     }
frontend-1          | [1]     responseTime: 0.6419959962368011
frontend-1          | [1] [17:15:28 UTC] INFO: incoming request
frontend-1          | [1]     reqId: "req-q"
frontend-1          | [1]     req: {
frontend-1          | [1]       "method": "GET",
frontend-1          | [1]       "url": "/login-view",
frontend-1          | [1]       "host": "localhost:8000",
frontend-1          | [1]       "remoteAddress": "172.18.0.1",
frontend-1          | [1]       "remotePort": 53026
frontend-1          | [1]     }
frontend-1          | [1] [17:15:28 UTC] INFO: request completed
frontend-1          | [1]     reqId: "req-q"
frontend-1          | [1]     res: {
frontend-1          | [1]       "statusCode": 200
frontend-1          | [1]     }
frontend-1          | [1]     responseTime: 2.52071800082922
user_container      | username: hi, password: hi
frontend-1          | [1] SHOULD GIVE ERRORRRRRRRRRRRRRRRRR
database_container  | [17:15:31 UTC] INFO: incoming request
database_container  |     reqId: "req-2"
database_container  |     req: {
database_container  |       "method": "POST",
database_container  |       "url": "/login",
database_container  |       "host": "database_container:3000",
database_container  |       "remoteAddress": "172.18.0.2",
database_container  |       "remotePort": 39434
database_container  |     }
database_container  | [17:15:31 UTC] INFO: request completed
database_container  |     reqId: "req-2"
database_container  |     res: {
database_container  |       "statusCode": 500
database_container  |     }