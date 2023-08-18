const {
	selectArticleById,
	selectArticles,
	countArticleComments,
	updateArticleVotes
} = require('../models/article.model');


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

exports.updateArticleById = (req, res, next) => {
	const { article_id } = req.params;
	const { inc_votes } = req.body;

	if (inc_votes === undefined) {
		return res.status(400).send({ message: 'inc_votes is missing or invalid' });
	}
	if (isNaN(inc_votes)) {
		return res.status(400).send({ message: 'inc_votes must be a number' });
	}

	updateArticleVotes(article_id, inc_votes)
		.then((updateArticle) => {
			res.status(200).send({ article: updateArticle })
		})
		.catch(next)
}

