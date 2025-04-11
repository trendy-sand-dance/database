import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';

	// dev
	import {getHome} from "../controllers/dev/getHome.controller";
	import {viewDB} from "../controllers/dev/userDev/viewDB.controller";
	import {viewID} from "../controllers/dev/userDev/viewID.controller";
	import {viewFile} from "../controllers/dev/userDev/viewFile.controller";
	//import {editAvatar} from "../controllers/dev/userDev/avatar.controller";
	
	// web
	import {dash} from "../controllers/web/dash.controller";
	
	// user endpoints
	import {register} from "../controllers/user/register.controller";
	import {login} from "../controllers/user/login.controller";
	import {logout} from "../controllers/user/logout.controller";
	import {editUsername} from "../controllers/user/edit.controller"
	import {editPassword} from "../controllers/user/edit.controller"
	import {editEmail} from "../controllers/user/edit.controller"
	import {deleteUser} from "../controllers/user/delete.controller"
	//import {editAvatar} from "../controllers/user/avatar.controller";
	import {deleteAvatar} from "../controllers/user/avatar.controller";

	// game endpoints
	// online users, game history, game options...
	
import fs from 'fs';
import { pipeline } from 'stream';
import { promisify } from 'util';
import path  from 'path';

const pump = promisify(pipeline);

async function routes(fastify: FastifyInstance) {
	
	fastify.post('/upload/:filename', async (request, reply) => {
		const { filename } = request.params as { filename: string };
		
		const filePath = path.join(__dirname, 'uploads', filename); // Make sure the file path is correct
		//const filePath = `./uploads/${filename}`;

		if (!fs.existsSync('/uploads')) {
			fs.mkdirSync('./uploads');
		}
		const data = await request.file();
		if (!data)
				return reply.status(404).send("not found");
		await pump(data.file, fs.createWriteStream(filePath));

		const dbRecord = await request.server.prisma.uploadedFile.create({
			data: { filename, filePath }
		})
		return reply.send({
			message: "success",
			record: dbRecord,
		});
	})


	// dev
	fastify.get('/', getHome);
	fastify.get('/viewDB', viewDB);
	fastify.get('/viewID', viewID);
	fastify.get('/viewFile/:username', viewFile);
	//fastify.get('/editAvatar/:username/:file', editAvatar);
	
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
	//fastify.post('/editAvatar/:username', editAvatar);
	fastify.post('/deleteAvatar/:username', deleteAvatar);
	
	// game endpoints
	// online users, game history, game options...

};

export default routes;
