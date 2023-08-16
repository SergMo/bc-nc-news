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
	selectArticles()
		.then((articles) => {
			const articleIDs = articles.map((article) => article.article_id);
			return Promise.all(articleIDs.map((article_id) => countArticleComments(article_id)))
				.then((commentCounts) => {
					const articleWithCount = articles.map((article, index) => (
						{
							...article,
							comment_count: commentCounts[index],
						}
					))
					res.status(200).send({ articles: articleWithCount })
				})
		})
		.catch(next)
}

