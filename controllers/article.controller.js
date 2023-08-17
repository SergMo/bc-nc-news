const { selectArticleById, selectArticles, countArticleComments } = require('../models/article.model');


exports.getArticleById = (req, res, next) => {
	const { article_id } = req.params;
	selectArticleById(article_id)
		.then((article) => {
			res.status(200).send({ article });
		})
		.catch(next);
};

exports.getAllArticles = (req, res, next) => {
	Promise.all([selectArticles(), countArticleComments()])
		.then(([articles, commentCounts]) => {
			const articlesWithCount = articles.map((article) => {
				return {
					...article,
					comment_count: commentCounts[articles.article_id] || 0
				}
			});
			res.status(200).send({ articles: articlesWithCount });
		})

		.catch(next);
};

