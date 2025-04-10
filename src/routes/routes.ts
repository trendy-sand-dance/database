import { FastifyInstance } from 'fastify';

	// dev
	import {getHome} from "../controllers/dev/getHome.controller";
	import {viewDB} from "../controllers/dev/viewDB.controller";
	import {viewID} from "../controllers/dev/viewID.controller";

	// user endpoints
	// user
	import {dash} from "../controllers/userManagement/user/dash.controller";
	import {register} from "../controllers/userManagement/user/register.controller";
	import {login} from "../controllers/userManagement/user/login.controller";
	import {logout} from "../controllers/userManagement/user/logout.controller";
	import {editUsername} from "../controllers/userManagement/user/edit.controller"
	import {editPassword} from "../controllers/userManagement/user/edit.controller"
	import {editEmail} from "../controllers/userManagement/user/edit.controller"
	import {deleteUser} from "../controllers/userManagement/user/delete.controller"
	import {editAvatar} from "../controllers/userManagement/user/avatar.controller";
	import {deleteAvatar} from "../controllers/userManagement/user/avatar.controller";
	// friends
	import {friends} from "../controllers/friends/friends.controller";
	// stats
	import {wins} from "../controllers/controllers/userManangement/stats/stats.controller";
	import {losses} from "../controllers/controllers/userManangement/stats/stats.controller";

	// game endpoints
	// online users, game history, game options...
	

async function routes(fastify: FastifyInstance) {
		
	// dev
	fastify.get('/', getHome);
	fastify.get('/viewDB', viewDB);
	fastify.get('/viewID', viewID);
	
	// user management endpoints
	// user
	fastify.get('/dashboard/:username', dash);
	fastify.post('/register', register);
	fastify.post('/login', login);
	fastify.get('/logout/:username', logout);
	fastify.post('/editUsername/:username', editUsername);
	fastify.post('/editPassword/:username', editPassword);
	fastify.post('/editEmail/:username', editEmail);
	fastify.delete('/delete/:username', deleteUser);
	fastify.post('/editAvatar/:username', editAvatar);
	fastify.post('/deleteAvatar/:username', deleteAvatar);
	// friends
	fastify.get('/friends/:username', friends);
	// stats
	fastify.get('/wins/:username', wins);
	fastify.get('/losses/:username', losses);
	

	// game endpoints
	// online users, game history, game options...

};

export default routes;
