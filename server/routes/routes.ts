import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';

	// dev
	import {getHome} from "../controllers/dev/getHome.controller";
	import {populate, viewDB, viewID, viewChat} from "../controllers/dev/userDev/view.controller";
	import {sendReqDev, acceptReqDev, rejectReqDev} from "../controllers/dev/userDev/friendRequests.controller";
	import {makeMatchD, saveMatchD, viewUserMatch, viewWonMatch, viewLostMatch, viewFriendMatch, viewFvsU} from "../controllers/dev/userDev/matchDev.controller";
	import {chatDev} from "../controllers/dev/userDev/chatDev.controller";

	// web
	import {dash} from "../controllers/web/dash.controller";
	
	// user endpoints
	import {register, login, logout} from "../controllers/user/register.controller";
	import {editUsername, editPassword, editEmail, deleteUser} from "../controllers/user/editUser.controller"
	import {editAvatar, deleteAvatar} from "../controllers/user/avatar.controller";
	import {sendFriendReq, acceptFriendReq, rejectFriendReq, blockFriend, viewPlayers, deleteAssociation} from "../controllers/user/friends.controller";
	import {makeMatch, saveMatch, getUserMatches, getInProgressMatches, getWonMatches, getLostMatches, getFriendMatches, getFriendvsUser	} from "../controllers/user/stats.controller";
	//import {createChat, retrieveChat, updateChat, deleteChat, blockedChat} from "../controllers/user/chat.controller";

// game endpoints
import { getPlayer, getPlayerInfo, updatePlayer, syncPlayers } from "../controllers/game/player.controller";

async function routes(fastify: FastifyInstance) {

  // dev
  fastify.get('/', getHome);
  fastify.get('/populate', populate);
  fastify.get('/viewDB', viewDB);
  fastify.get('/viewID', viewID);
  fastify.get('/viewChat', viewChat);
  fastify.get('/makeMatchD/:player1/:player2', makeMatchD);
  fastify.get('/saveMatchD/:match/:won/:lost', saveMatchD);
  fastify.get('/viewUserMatch/:userId', viewUserMatch);
  fastify.get('/viewWonMatch/:userId', viewWonMatch);
  fastify.get('/viewLostMatch/:userId', viewLostMatch);
  fastify.get('/viewFriendMatch/:userId/:friendId', viewFriendMatch);
  fastify.get('/viewFvsU/:userId/:friendId', viewFvsU);
  fastify.get('/sendReqD/:receiverId/:userId', sendReqDev);
  fastify.get('/acceptReqD/:senderId/:userId', acceptReqDev);
  fastify.delete('/rejectReqD/:senderId/:userId', rejectReqDev);
  fastify.get('/makeChat/:user1Id/:user2Id', chatDev);
  
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
  
  // user friend endpoints
  fastify.post('/sendReq/:receiverId/:userId', sendFriendReq); // person receiving a friend request, sent by this user
  fastify.post('/acceptReq/:senderId/:userId', acceptFriendReq); // sender is person who sent request, this user is accepting their request
  fastify.delete('/rejectReq/:senderId/:userId', rejectFriendReq); // sender is person who sent request, this user is rejecting their request
  fastify.delete('/deletefriend/:senderId/:userId', deleteAssociation); 
  fastify.post('/block/:friendId/:userId', blockFriend); // friend is person who user wants to block
  fastify.get('/viewPlayers/:username', viewPlayers); 

  // user statistics/matches endpoints
  fastify.post('/makeMatch/:player1/:player2', makeMatch);
  fastify.post('/saveMatch/:matchId/:winnerId/:loserId', saveMatch);
  fastify.get('/getUserMatches/:userId', getUserMatches);
  fastify.get('/getInProgressMatches', getInProgressMatches);
  fastify.get('/getWonMatches/:userId', getWonMatches);
  fastify.get('/getLostMatches/:userId', getLostMatches);
  fastify.get('/getFriendMatches/:userId/:friendId', getFriendMatches);
  fastify.get('/getFriendvsUser/:userId/:friendId', getFriendvsUser);

  // chat endpoints
  // user1 is the logged in user looking at their chat history with another player (user2)
//  fastify.post('createChat/:user1Id/:user2Id', createChat);
//  fastify.post('retrieveChat/:user1Id/:user2Id', retrieveChat);
//  fastify.post('updateChat/:user1Id/:user2Id', updateChat);
//  fastify.post('deleteChat/:user1Id/:user2Id', deleteChat);
//  fastify.post('blockedChat/:user1Id/:user2Id', blockedChat);

  // game endpoints
  // online users, game history, game options...
  fastify.get('/game/players/:username', getPlayer);
  fastify.put('/game/players/:id', updatePlayer);
  fastify.put('/game/players', syncPlayers);

  fastify.get('/game/playerinfo/:id', getPlayerInfo);

};

export default routes;
