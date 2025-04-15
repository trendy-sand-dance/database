import { FastifyRequest, FastifyReply } from 'fastify';
import fs from 'fs';
import path  from 'path';

/** @todo - check existsSync/existsAsync */

export const getImage = async (request: FastifyRequest, reply: FastifyReply): Promise<any> => {
	try {
		const { filename } = request.params as { filename: string };
		const wrkdir = process.cwd();
		const uploadDir = path.join(wrkdir, 'uploads');
		const filePath = path.join(uploadDir, filename);
		if (!fs.existsSync( filePath ))
			throw { code: 404, message: "File doesn't exist"};
		
		return reply.code(200).sendFile(filename);//.send({ message: "successfully sent image"});


		//return reply.code(200).send({ message: "sent image successfully"});
	} catch (error) {
		console.error(error);
		return reply.code(500).send({ error: "Failed to send image" });
	}
};