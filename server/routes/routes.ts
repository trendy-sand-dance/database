import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';

	// dev
	import {getHome} from "../controllers/dev/getHome.controller";
	import {viewDB, viewID} from "../controllers/dev/userDev/view.controller";
	import { sendReq, acceptReq, rejectReq } from "../controllers/dev/userDev/friendRequests.controller";

	// web
	import {dash} from "../controllers/web/dash.controller";
	
	// user endpoints
	import {register, login, logout} from "../controllers/user/register.controller";
	import {editUsername, editPassword, editEmail, deleteUser} from "../controllers/user/edit.controller"
	import {editAvatar, deleteAvatar} from "../controllers/user/avatar.controller";

// game endpoints
// online users, game history, game options...
import { getPlayer, updatePlayer } from "../controllers/game/player.controller";


async function routes(fastify: FastifyInstance) {

  // dev
  fastify.get('/', getHome);
  fastify.get('/viewDB', viewDB);
  fastify.get('/viewID', viewID);
  fastify.get('/sendreq/:sender/:receiver', sendReq);
  fastify.get('/acceptreq/:sender/:receiver', acceptReq);
  fastify.get('/rejectreq/:sender/:receiver', rejectReq);

  // web
  fastify.get('/dashboard/:username', dash);

  // user management endpoints
  fastify.post('/register', register);
  fastify.post('/login', login);
  fastify.get('/logout/:username', logout);
  fastify.post('/editUsername/:username', editUsername);
  fastify.post('/editPassword/:username', editPassword);


  fastify.post('/editEmail/:username', editEmail);
  fastify.delete('/delete/:username', deleteUser);
  fastify.post('/editAvatar/:username', editAvatar);
  fastify.post('/deleteAvatar/:username', deleteAvatar);

  // game endpoints
  // online users, game history, game options...
  fastify.get('/game/players/:username', getPlayer);
  fastify.put('/game/players/:username', updatePlayer);

};

export default routes;
