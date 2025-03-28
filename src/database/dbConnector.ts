import Database from 'better-sqlite3';
import fp from "fastify-plugin";
import fs from 'fs';
import path from 'node:path';
import { FastifyInstance } from 'fastify';

const databasePath = path.join(__dirname, '/database.db');

async function dbConnector(fastify: FastifyInstance): Promise<void> {
	let db;

	if (fs.existsSync(databasePath)) {
		console.log("Database already exists at: ", databasePath);
		db = new Database(databasePath, { verbose: console.log });
	}
	else {
		console.log("Creating new database at: ", databasePath);
		db = new Database(databasePath, { verbose: console.log });

		// todo: check the position x,y statement is correct
		try {
			db.exec(`
				CREATE TABLE IF NOT EXISTS gameTable (
					id INTEGER PRIMARY KEY,
					username TEXT NOT NULL UNIQUE,
					avatar TEXT,
					status BOOLEAN DEFAULT FALSE,
					position INTEGER INTEGER,
					elo_rating INTEGER
				);
			`);
			console.log("Created gameTable successfully.");
			
			db.exec(`
				CREATE TABLE IF NOT EXISTS userTable (
					id INTEGER PRIMARY KEY,
					username TEXT NOT NULL UNIQUE,
					password TEXT NOT NULL,
					email TEXT NOT NULL,
					avatar TEXT,
					status BOOLEAN DEFAULT FALSE
				);
			`);
			console.log("Created userTable successfully.");
		} catch (error) {
			console.error("Error creating tables:", error);
		}
	}
	fastify.decorate("db", db);
	console.log("Fastify instance has 'db':", fastify.hasDecorator('db'));

	fastify.addHook("onClose", (fastify, done) => {
		if (db) {
			db.close();
		}
		done();
	});
};

export default fp(dbConnector);