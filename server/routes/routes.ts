import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';

	// dev
	import {getHome} from "../controllers/dev/getHome.controller";
	import {viewDB, viewID} from "../controllers/dev/userDev/view.controller";
	import {sendReqDev, acceptReqDev, rejectReqDev, viewAllFriendsDev, viewOnlyFriendsDev} from "../controllers/dev/userDev/friendRequests.controller";

	// web
	import {dash} from "../controllers/web/dash.controller";
	
	// user endpoints
	import {register, login, logout} from "../controllers/user/register.controller";
	import {editUsername, editPassword, editEmail, deleteUser} from "../controllers/user/editUser.controller"
	import {editAvatar, deleteAvatar} from "../controllers/user/avatar.controller";
	import {sendReq, acceptReq, rejectReq, block, viewAllFriends, viewOnlyFriends} from "../controllers/user/friends.controller";
	import {getStats, updateWins, updateLosses} from "../controllers/user/stats.controller";

// game endpoints
import { getPlayer, getPlayerInfo, updatePlayer, syncPlayers } from "../controllers/game/player.controller";

async function routes(fastify: FastifyInstance) {

  // dev
  fastify.get('/', getHome);
  fastify.get('/viewDB', viewDB);
  fastify.get('/viewID', viewID);
  fastify.get('/sendReqD/:receiverId/:userId', sendReqDev);
  fastify.get('/acceptReqD/:senderId/:userId', acceptReqDev);
  fastify.delete('/rejectReqD/:senderId/:userId', rejectReqDev);
  fastify.get('/viewAllFriendsD/:username', viewAllFriendsDev); 
  fastify.get('/viewOnlyFriendsD/:username', viewOnlyFriendsDev); 
  
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
  // user friend endpoints
  fastify.post('/sendReq/:receiverId/:userId', sendReq); // person receiving a friend request, sent by this user
  fastify.post('/acceptReq/:senderId/:userId', acceptReq); // sender is person who sent request, this user is accepting their request
  fastify.delete('/rejectReq/:senderId/:userId', rejectReq); // sender is person who sent request, this user is rejecting their request
  fastify.post('/block/:friendId/:userId', block); // friend is person who user wants to block
  fastify.get('/viewAllFriends/:username', viewAllFriends); 
  fastify.get('/viewOnlyFriends/:username', viewOnlyFriends); 

  // user avatar endpoints
  fastify.post('/editAvatar/:username', editAvatar);
  fastify.post('/deleteAvatar/:username', deleteAvatar);
  // user statistics endpoints
  fastify.get('/stats/:username', getStats);
  fastify.post('/addWin/:username', updateWins);
  fastify.post('/addLoss/:username', updateLosses);

  // game endpoints
  // online users, game history, game options...
  fastify.get('/game/players/:username', getPlayer);
  fastify.put('/game/players/:id', updatePlayer);
  fastify.put('/game/players', syncPlayers);

  fastify.get('/game/playerinfo/:id', getPlayerInfo);

};

export default routes;
