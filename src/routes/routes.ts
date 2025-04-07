import { FastifyInstance } from 'fastify';

	// dev
	import {getHome} from "../controllers/dev/getHome.controller";
	import {viewDB} from "../controllers/dev/userDev/viewDB.controller";
	import {viewID} from "../controllers/dev/userDev/viewID.controller";

	// user endpoints
	import {register} from "../controllers/user/register.controller";
	import {login} from "../controllers/user/login.controller";
	import {logout} from "../controllers/user/logout.controller";
	import {editUsername} from "../controllers/user/edit.controller"
	import {editPassword} from "../controllers/user/edit.controller"
	import {deleteUser} from "../controllers/user/delete.controller"
		// avatar controllers
		//import {addAvatar} from "../controllers/user/avatar/addAvatar.controller";
		//import {editAvatar} from "../controllers/user/avatar/editAvatar.controller";
		//import {deleteAvatar} from "../controllers/user/avatar/deleteAvatar.controller";

	// web
	import {dash} from "../controllers/web/dash.controller";
	
	// game endpoints

async function routes(fastify: FastifyInstance) {

	// dev
	fastify.get('/', getHome);
	fastify.get('/viewDB', viewDB);
	fastify.get('/viewID', viewID);

	// user management endpoints
	fastify.post('/register', register);
	fastify.post('/login', login);
	fastify.post('/logout', logout);
	fastify.post('/editUsername', editUsername);
	fastify.post('/editPassword', editPassword);
	fastify.delete('/delete', deleteUser);
		// avatar controllers
		// fastify.post('/addAvatar', addAvatar);
		// fastify.post('/editAvatar', editAvatar);
		// fastify.delete('/deleteAvatar', deleteAvatar);

	// web
	fastify.get('/dash/:username', dash);

	// game endpoints

};

export default routes;
