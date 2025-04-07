import { FastifyInstance } from 'fastify';

	// dev
	import {getHome} from "../controllers/dev/getHome.controller";
	import {viewDB} from "../controllers/dev/userDev/viewDB.controller";
	import {viewID} from "../controllers/dev/userDev/viewID.controller";
	//import {addMemberDev} from "../controllers/dev/userDev/addMemberDev.controller";
	//import {createManyDev} from "../controllers/dev/userDev/createManyDev.controller";
	//import {deleteMemberDev} from "../controllers/dev/userDev/deleteMemberDev.controller";

	// user endpoints
	import {register} from "../controllers/user/register.controller";
	import {login} from "../controllers/user/login.controller";
	import {logout} from "../controllers/user/logout.controller";
	
	// web
	//import {getDashUser} from "../controllers/web/getDashUser.controller";
	
	// game endpoints

async function routes(fastify: FastifyInstance) {

	// dev
	fastify.get('/', getHome);
	fastify.get('/viewDB', viewDB);
	fastify.get('/viewID', viewID);
	//fastify.get('/addMemberDev', addMemberDev(fastify));
	//fastify.get('/createManyDev', createManyDev(fastify));
	//fastify.get('/deleteMemberDev', deleteMemberDev(fastify));

	// user management endpoints
	fastify.post('/register', register);
	fastify.get('/login', login);
	fastify.get('/logout', logout);



	// web
	//fastify.get('/dash/:username', getDashUser);

	// game endpoints

};

export default routes;
