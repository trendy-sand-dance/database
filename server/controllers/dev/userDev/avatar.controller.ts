import { FastifyRequest, FastifyReply } from 'fastify';

//import fs from 'fs';
//import { pipeline } from 'stream';
//import { promisify } from 'util';

//const pump = promisify(pipeline);

//export const editAvatar = async (request: FastifyRequest, reply: FastifyReply): Promise<any> => {
//	try {
//		//const { username, file } = request.params as { username: string, file: File };
//		const { username, file } = request.params as { username: string, file: File };
//		const user = await request.server.prisma.user.findUnique({
//			where: { username: username }
//		});
//		console.log("user ", user.username);
//		console.log("file = ", file.);

//		// save/upload to uploads directory
//		// get end of path
//		// update user in db



//			// like reuqest.body
//		//const avatarFile = await request.file();
//		//console.log("avatarfile.filename = ", avatarFile);


//		// upload and save the file
//		//await pump(part.file, fs.createWriteStream(`./uploads/${part.filename}`))


//		// get needed file_path to add to user db avatar stuff

//		//const newAvatar = avatarFile as String;

//		//await request.server.prisma.user.update({
//        //    where: { username: username },
//		//	data: {
//		//		avatar: newAvatar
//		//	},
//        //});
//		return reply.code(200).send({ message: "Edited avatar successfully"});
//	} catch (error) {
//		console.error(error);
//		return reply.code(500).send({ error: "Failed to edit avatar" });
//	}
//};

//export const editAvatar = async (request: FastifyRequest, reply: FastifyReply): Promise<any> => {
//	try {
//		const { username } = request.params as { username: string };
//		const { newAvatar } = request.body as { newAvatar: string };

//		await request.server.prisma.user.update({
//            where: { username: username },
//			data: {
//				avatar: newAvatar
//			},
//        });
//		return reply.code(200).send({ message: "Edited avatar successfully"});
//	} catch (error) {
//		console.error(error);
//		return reply.code(500).send({ error: "Failed to edit avatar" });
//	}
//};

//export const deleteAvatar = async (request: FastifyRequest, reply: FastifyReply): Promise<any> => {
//	try {
//		const { username } = request.params as { username: string };
	
//		await request.server.prisma.user.update({
//            where: { username: username },
//			data: {
//				avatar: "img_avatar.png"
//			},
//        });
//		return reply.code(200).send({ message: "Deleted avatar successfully"});
//	} catch (error) {
//		console.error(error);
//		return reply.code(500).send({ error: "Failed to delete avatar" });
//	}
//};
