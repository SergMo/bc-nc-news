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