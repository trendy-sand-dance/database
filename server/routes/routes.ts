import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';

	// dev
	import {getHome} from "../controllers/dev/getHome.controller";
	import {populate, viewDB, viewID} from "../controllers/dev/userDev/view.controller";
	import {sendReqDev, acceptReqDev, rejectReqDev} from "../controllers/dev/userDev/friendRequests.controller";
	import {makeMatch, viewUserMatch, viewWonMatch, viewLostMatch, viewFriendMatch, viewFvsU} from "../controllers/dev/userDev/matchDev.controller";

	// web
	import {dash} from "../controllers/web/dash.controller";
	
	// user endpoints
	import {register, login, logout} from "../controllers/user/register.controller";
	import {editUsername, editPassword, editEmail, deleteUser} from "../controllers/user/editUser.controller"
	import {editAvatar, deleteAvatar} from "../controllers/user/avatar.controller";
	import {sendFriendReq, acceptFriendReq, rejectFriendReq, blockFriend, viewPlayers} from "../controllers/user/friends.controller";
	import {saveMatch, getUserMatches, getWonMatches, getLostMatches, getFriendMatches, getFriendvsUser	} from "../controllers/user/stats.controller";

// game endpoints
import { getPlayer, getPlayerInfo, updatePlayer, syncPlayers } from "../controllers/game/player.controller";

async function routes(fastify: FastifyInstance) {

  // dev
  fastify.get('/', getHome);
  fastify.get('/populate', populate);
  fastify.get('/viewDB', viewDB);
  fastify.get('/viewID', viewID);
  
  fastify.get('/makeMatch/:won/:lost', makeMatch);
  fastify.get('/viewUserMatch', viewUserMatch);
  fastify.get('/viewWonMatch', viewWonMatch);
  fastify.get('/viewLostMatch', viewLostMatch);
  fastify.get('/viewFriendMatch/:firendId', viewFriendMatch);
  fastify.get('/viewFvsU/:firendId', viewFvsU);
  
  fastify.get('/sendReqD/:receiverId/:userId', sendReqDev);
  fastify.get('/acceptReqD/:senderId/:userId', acceptReqDev);
  fastify.delete('/rejectReqD/:senderId/:userId', rejectReqDev);
  
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
  fastify.post('/sendReq/:receiverId/:userId', sendFriendReq); // person receiving a friend request, sent by this user
  fastify.post('/acceptReq/:senderId/:userId', acceptFriendReq); // sender is person who sent request, this user is accepting their request
  fastify.delete('/rejectReq/:senderId/:userId', rejectFriendReq); // sender is person who sent request, this user is rejecting their request
  fastify.post('/block/:friendId/:userId', blockFriend); // friend is person who user wants to block
  fastify.get('/viewPlayers/:username', viewPlayers); 
  // user avatar endpoints
  fastify.post('/editAvatar/:username', editAvatar);
  fastify.post('/deleteAvatar/:username', deleteAvatar);
  // user statistics/matches endpoints
  fastify.post('/saveMatch/:won/:lost', saveMatch);
  fastify.get('/getUserMatches', getUserMatches);
  fastify.get('/getWonMatches', getWonMatches);
  fastify.get('/getLostMatches', getLostMatches);
  fastify.get('/getFriendMatches/:friendId', getFriendMatches);
  fastify.get('/getFriendvsUser/:friendId', getFriendvsUser);

  // game endpoints
  // online users, game history, game options...
  fastify.get('/game/players/:username', getPlayer);
  fastify.put('/game/players/:id', updatePlayer);
  fastify.put('/game/players', syncPlayers);

  fastify.get('/game/playerinfo/:id', getPlayerInfo);

};

export default routes;
