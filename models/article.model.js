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
		.query('SELECT article_id, title, author, topic, created_at, votes, article_img_url FROM articles ORDER BY created_at DESC')
		.then((result) => result.rows);
}

exports.countArticleComments = (article_id) => {
	return db
		.query('SELECT COUNT(*) FROM comments WHERE article_id = $1', [article_id])
		.then((result) => parseInt(result.rows[0].count))
}