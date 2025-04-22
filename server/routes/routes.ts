import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';

// dev
import { getHome } from "../controllers/dev/getHome.controller";
import { viewDB, viewID } from "../controllers/dev/userDev/view.controller";

// web
import { dash } from "../controllers/web/dash.controller";

// user endpoints
import { register, login, logout } from "../controllers/user/register.controller";
import { editUsername, editPassword, editEmail, deleteUser } from "../controllers/user/edit.controller"
import { editAvatar, deleteAvatar } from "../controllers/user/avatar.controller";
import { getImage } from "../controllers/web/image.controller";

// game endpoints
// online users, game history, game options...
import { getPlayer, getPlayerInfo, updatePlayer } from "../controllers/game/player.controller";


async function routes(fastify: FastifyInstance) {

  // dev
  fastify.get('/', getHome);
  fastify.get('/viewDB', viewDB);
  fastify.get('/viewID', viewID);

  // web
  fastify.get('/dashboard/:username', dash);
  fastify.get('/image/:filename', getImage);

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
  fastify.put('/game/players/:id', updatePlayer);

  fastify.get('/game/playerinfo/:id', getPlayerInfo);

};

export default routes;
