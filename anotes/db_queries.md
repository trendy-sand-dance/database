

/**
 * manually add user (need request param)
 * 
 *	const db = request.server.db;
 *	const stmt = db.prepare("INSERT INTO userTable (username, password, email, status) VALUES (?, ?, ?, ?)");
 *	const result = stmt.run("<username>", "<password>", "<email>", 0);
 */


/**
 * edit user status between logged in (1) and not logged in (0) 
 * 
  	const stmt = db.prepare('SELECT * FROM userTable WHERE username = ? AND password = ?');
		const user = stmt.get(username, password);
		if (user)
		{
			const stmt = db.prepare("UPDATE userTable SET status = ? WHERE username = ? AND password = ?");
			const result = stmt.run(1, "<username>", "<password>");
		}
 *
 */