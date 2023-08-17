const db = require('../db/connection');

exports.selectArticleById = (article_id) => {
	return db
		.query('SELECT * FROM articles WHERE article_id = $1;', [article_id])
		.then((article) => {
			if (article.rows.length === 0) {
				return Promise.reject(new Error('Article not found'));
			}
			return article.rows[0];
		})
}

exports.selectArticles = () => {
	return db
		.query(
			'SELECT article_id, title, author, topic, created_at, votes, article_img_url FROM articles ORDER BY created_at DESC;')
		.then((result) => result.rows);
}

exports.countArticleComments = () => {
	return db
		.query(
			`
		SELECT articles.article_id, COUNT(comments.comment_id) AS comment_count
		FROM articles
		LEFT JOIN comments ON articles.article_id = comments.article_id
		GROUP by articles.article_id;
		`
		)
		.then((result) => {
			const commentCounts = {};
			result.rows.forEach((row) => {
				commentCounts[row.article_id] = row.comment_count;
			})
			return commentCounts;
		});
};