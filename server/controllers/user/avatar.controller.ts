import { FastifyRequest, FastifyReply } from 'fastify';
import fs from 'fs';
import path  from 'path';

export const editAvatar = async (request: FastifyRequest, reply: FastifyReply): Promise<any> => {
	try {
		const { username } = request.params as { username: string };
	
		const avatarFile = await request.file();
		if (!avatarFile) {
			throw { code: 500, message: "Failed to receive file"};
		}

		const buffer = await avatarFile.toBuffer();
		const wrkdir = process.cwd();
		const uploadDir = path.join(wrkdir, 'uploads');
		if (!fs.existsSync(uploadDir)) {
			fs.mkdirSync(uploadDir, { recursive: true });
		}
		const filePath = path.join(uploadDir, avatarFile.filename);
		fs.writeFile(filePath, buffer, (err) => {
		if (err) {
			throw { code: 500, message: "Erroring writing file" };
		}});

		const filename = avatarFile.filename;
		const dbRecord = await request.server.prisma.uploadedFile.create({
			data: { filename }
		});
		await request.server.prisma.user.update({
		where: { username: username },
		data: {
			avatar: filename
			},
		});

		return reply.code(200).send({ message: "Uploaded avatar successfully"});
	} catch (error) {
		console.error(error);
		return reply.code(500).send({ error: "Failed to upload new avatar" });
	}
};

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
