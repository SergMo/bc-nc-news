const db = require('../db/connection');

exports.selectCommentsByArticleId = (article_id) => {
	return db
		.query(
			`
			SELECT comment_id,votes, created_at, author, body, article_id
			FROM comments
			WHERE article_id = $1
			ORDER BY created_at DESC
			`,
			[article_id]
		)
		.then((result) => result.rows)
}

exports.insertComment = (article_id, username, body) => {
	return db
		.query(
			`INSERT INTO comments (article_id, author, body) VALUES ($1, $2, $3) RETURNING *`,
			[article_id, username, body]
		)
		.then((result) => result.rows[0])
}

exports.removeCommentById = (comment_id) => {
	return db
		.query(
			`DELETE FROM comments 
			WHERE comment_id = $1
			RETURNING *
			`,
			[comment_id]
		)
		.then((result) => {
			return result.rowCount
		});
}