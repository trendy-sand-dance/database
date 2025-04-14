import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';

	// dev
	import {getHome} from "../controllers/dev/getHome.controller";
	import {viewDB} from "../controllers/dev/userDev/viewDB.controller";
	import {viewID} from "../controllers/dev/userDev/viewID.controller";
	import {viewFile} from "../controllers/dev/userDev/viewFile.controller";
	
	// web
	import {dash} from "../controllers/web/dash.controller";
	
	// user endpoints
	import {register, login, logout} from "../controllers/user/register.controller";
	import {editUsername, editPassword, editEmail, deleteUser} from "../controllers/user/edit.controller"
	//import {editAvatar} from "../controllers/user/avatar.controller";
	import {deleteAvatar} from "../controllers/user/avatar.controller";

	// game endpoints
	// online users, game history, game options...
	
import fs from 'fs';
import { pipeline } from 'stream';
import { promisify } from 'util';
import path  from 'path';
//import FormData from 'form-data';
//import fetch from 'node-fetch';


const pump = promisify(pipeline);

async function routes(fastify: FastifyInstance) {
	
	fastify.post('/editAvatar/:username', async (request: FastifyRequest, reply: FastifyReply): Promise<any> => {
		console.log("received request from frontend");
		const { username } = request.params as { username: string };
		console.log("username = ", username);

		const fileName = request.body as { fileName: string};
		console.log("filename = ", fileName);
		const data = await request.file();
		if (!data)
				console.log("no dataaaa");


		//const buffer = await data.toBuffer();
		return reply.code(418);
		//const filename = request.body as string;
		//const filePath = path.join(__dirname, 'uploads', filename);
		//console.log("file path = ", filePath);
		//return reply.code(45);
		//if (!fileData)
		//await pump(fileData, fs.)
		
		//const filePath = path.join(__dirname, 'uploads', filename); // Make sure the file path is correct
		//const filename = request.body; //only the name part necessary here 
		//const filePath = `./uploads/${filename}`;

		//console.log("filename = ", filename, " filepath = ", filePath);

		//if (!fs.existsSync('/uploads')) {
		//	fs.mkdirSync('./uploads');
		//}
		//const data = await request.file();
		//if (!data)
		//		return reply.status(404).send("not found");
		//await pump(data.file, fs.createWriteStream(filePath));

		//const dbRecord = await request.server.prisma.uploadedFile.create({
		//	data: { filename, filePath }
		//})
		//return reply.send({
		//	message: "success",
		//	record: dbRecord,
		//});
	})


	// dev
	fastify.get('/', getHome);
	fastify.get('/viewDB', viewDB);
	fastify.get('/viewID', viewID);
	fastify.get('/viewFile/:username', viewFile);
	
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
