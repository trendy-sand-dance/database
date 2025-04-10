import { FastifyRequest, FastifyReply } from 'fastify';
import fs from 'fs';

export const editAvatar = async (request: FastifyRequest, reply: FastifyReply): Promise<any> => {
	try {
		const { username } = request.params as { username: string };

		// body
		//const { newAvatarFile } = request.body as { newAvatarFile: string };
		//console.log("req body file - ", request.body.file);
		// just file

		const avatarFile = await request.file();

		//await pump(request.file, fs.createWriteStream(`../../../uploads/${avatarFile.filename}`));

		//console.log("avatarfile.path = ", avatarFile.path);
		//console.log("avatarfile.body = ", avatarFile.body);
		console.log("avatarfile.filename = ", avatarFile);


		// upload and save the file
		//await pump(part.file, fs.createWriteStream(`./uploads/${part.filename}`))


		// get needed file_path to add to user db avatar stuff
		const newAvatar = "new.png" as String;

		await request.server.prisma.user.update({
            where: { username: username },
			data: {
				avatar: newAvatar
			},
        });
		return reply.code(200).send({ message: "Edited avatar successfully"});
	} catch (error) {
		console.error(error);
		return reply.code(500).send({ error: "Failed to edit avatar" });
	}
};

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

export const deleteAvatar = async (request: FastifyRequest, reply: FastifyReply): Promise<any> => {
	try {
		const { username } = request.params as { username: string };
	
		await request.server.prisma.user.update({
            where: { username: username },
			data: {
				avatar: "img_avatar.png"
			},
        });
		return reply.code(200).send({ message: "Deleted avatar successfully"});
	} catch (error) {
		console.error(error);
		return reply.code(500).send({ error: "Failed to delete avatar" });
	}
};
