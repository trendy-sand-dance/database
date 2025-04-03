

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