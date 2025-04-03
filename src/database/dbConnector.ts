import { PrismaClient } from "@prisma/client";
import Database from 'better-sqlite3';
import fp from "fastify-plugin";
import fs from 'fs';
import path from 'node:path';
import { FastifyInstance } from 'fastify';

const databasePath = path.join(__dirname, '/database.db');
const prisma = new PrismaClient();

async function dbConnector(fastify: FastifyInstance): Promise<void> {
	let db;

	if (fs.existsSync(databasePath)) {
		console.log("Database already exists at: ", databasePath);
		db = new Database(databasePath, { verbose: console.log });
	}
	else {
		console.log("Creating new database at: ", databasePath);
		db = new Database(databasePath, { verbose: console.log });

		try {
			await prisma.$queryRaw`SELECT 1`;
			console.log("Created database successfully.");
		} catch (error) {
			console.error("Error initializing database:", error);
		  }
	}
	fastify.decorate("db", db);
	fastify.decorate("prisma", prisma);
	prisma.$connect();
	console.log("Fastify instance has 'db':", fastify.hasDecorator('db'));
	console.log("Fastify instance has 'prisma':", fastify.hasDecorator('prisma'));
	fastify.addHook("onClose", (fastify, done) => {
		done();
	});
};

export default fp(dbConnector);