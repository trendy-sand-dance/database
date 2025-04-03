import { FastifyInstance } from 'fastify';

// dev
import {getHome} from "../controllers/dev/getHome.controller";
	// game table
	//import {getGameDB} from "../controllers/dev/game/getGameDB.controller";
	//import {addGameData} from "../controllers/dev/game/addGameData.controller";
	//// user table
	//import {getUserDB} from "../controllers/dev/user/getUserDB.controller";
	//import {addUserDev} from "../controllers/dev/user/addUserDev.controller";
	//import {delUserDev} from "../controllers/dev/user/delUserDev.controller";
	//import {changeUserStatusDev} from "../controllers/dev/user/changeUserStatusDev.controller";
	//import {editUserDev} from "../controllers/dev/user/editUserDev.controller";
	// prisma
	import {addMember} from "../database/prisma/addMember";
	import {deleteMember} from "../database/prisma/deleteMember";
	import {getPrismaUsers} from "../database/prisma/prismaMembers";
	import {createMany} from "../database/prisma/createMany";

// web
//import {getDashUser} from "../controllers/web/getDashUser.controller";

async function routes(fastify: FastifyInstance) {

	// dev
	fastify.get('/', getHome);
		////user table
		//fastify.get('/userDB', getUserDB);
		//fastify.get('/addUser', addUserDev);
		//fastify.get('/delUser', delUserDev);
		//fastify.get('/statUser', changeUserStatusDev);
		//fastify.get('/eddyUser', editUserDev);
		//// gametable
		//fastify.get('/gameDB', getGameDB);
		//fastify.get('/addGame', addGameData);

		//prisma
		fastify.get('/prismaUsers', getPrismaUsers);
		fastify.get('/addMember', addMember);
		fastify.get('/deleteMember', deleteMember);
		fastify.get('/createMany', createMany);

	// web
	//fastify.get('/dash/:username', getDashUser);
};

export default routes;
