
import Database from 'better-sqlite3';
import path from 'path';

const databasePath = path.join(__dirname, '/database.db');
const db = new Database(databasePath, { verbose: console.log });

export interface DbOperations {
	query(sql: string, params?: any[]): any;
		//other db operations
}

const dbOperations: DbOperations = {
	query(sql: string, params?: any[]): any {
		const statement = db.prepare(sql);
		if (params) {
			return statement.all(params);
		}
		return statement.all();
	},
	// other db operations
};

process.on('exit', () => db.close());
process.on('SIGHUP', () => process.exit(128 + 1));
process.on('SIGINT', () => process.exit(128 + 2));
process.on('SIGTERM', () => process.exit(128 + 15));

export default dbOperations;



//import {Pool, QuesyResult } from 'pg';
//const pool = new Pool({
//	// db connection configuration
//});

//export interface DbOperations {
//	query(text: string, params?: any[]): Promimse<QueryResult>;
//	// other db operations 
//}

//const dbOperations: DbOperations = {
//	async query(text: string, params?: any[]): Promise<QueryResult> {
//		const client = await pool.connect();
//		try {
//			return await client.query(text, params);
//		} finally {
//			client.release();
//		}
//	},
//	// other db operations
//};

//export default dbOperations;