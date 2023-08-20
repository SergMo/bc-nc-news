const app = require('../app');
const request = require('supertest');
const db = require('../db/connection');
const seed = require('../db/seeds/seed');
const data = require('../db/data/test-data/');
const endpoints = require('../endpoints.json');


beforeEach(() => seed(data));
afterAll(() => db.end());

describe('GET /api/topics', () => {

	test('endpoint should return 200', () => {
		return request(app)
			.get('/api/topics')
			.then((response) => {
				expect(response.status).toBe(200);
			});
	});

	test('endpoint should return an array', () => {
		return request(app)
			.get('/api/topics')
			.then((response) => {
				expect(response.body.topics).toEqual(expect.any(Array));
			});
	});

	test('each topic should have "slug" and "description" properties', () => {
		return request(app)
			.get('/api/topics')
			.then((response) => {
				const topics = response.body.topics;
				expect(topics).toEqual(expect.any(Array));
				expect(topics.length).toBeGreaterThan(0);
				topics.forEach((topic) => {
					expect(topic).toHaveProperty('slug');
					expect(topic).toHaveProperty('description');
				});
			});
	});
});

describe('GET /api', () => {

	test('endpoint should return documentation of all available endpoints', () => {
		return request(app)
			.get('/api')
			.then((response) => {
				expect(response.body).toEqual(endpoints);
			})
	});
});

describe('GET /api/articles/:article_id', () => {

	test('GET:200 send an article by its ID', () => {
		return request(app)
			.get('/api/articles/1')
			.expect(200)
			.then((response) => {
				expect(response.body.article).toEqual({
					article_id: 1,
					title: "Living in the shadow of a great man",
					topic: "mitch",
					author: "butter_bridge",
					body: "I find this existence challenging",
					created_at: "2020-07-09T20:11:00.000Z",
					votes: 100,
					article_img_url:
						"https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
				});
			});
	});

	test('GET:404 should handle article not found', () => {
		return request(app)
			.get('/api/articles/999')
			.expect(404)
			.then((response) => {
				expect(response.body.message).toBe('Article not found');
			})
	});

	test('GET:400 should handle invalid article_id', () => {
		return request(app)
			.get('/api/articles/not-an-article')
			.expect(400)
			.then((response) => {
				expect(response.body.message).toBe('Invalid id');
			});
	});
});

describe('GET /api/articles', () => {

	test('GET:200 should return an array of articles', () => {
		return request(app)
			.get('/api/articles')
			.expect(200)
			.then((response) => {
				const articles = response.body.articles;
				expect(articles).toEqual(expect.any(Array));
				expect(articles.length).toBe(13);

				expect(articles).toEqual(
					expect.arrayContaining([
						expect.objectContaining({
							article_id: expect.any(Number),
							title: expect.any(String),
							author: expect.any(String),
							topic: expect.any(String),
							created_at: expect.any(String),
							votes: expect.any(Number),
							article_img_url: expect.any(String),
							comment_count: expect.any(Number),
						})
					])
				)
			})
	});

	test('articles should be sorted by date in descending order', () => {
		return request(app)
			.get('/api/articles')
			.expect(200)
			.then((response) => {
				const articles = response.body.articles;
				expect(articles).toBeSortedBy('created_at', { descending: true });
			})
	})
});

describe('GET /api/articles/:article_id/comments', () => {

	test('GET:200 should return an array of comments for the given article_id', () => {
		return request(app)
			.get('/api/articles/1/comments')
			.expect(200)
			.then((response) => {
				const comments = response.body.comments;
				expect(comments).toEqual(expect.any(Array));
				expect(comments.length).toBe(11);

				expect(comments).toEqual(
					expect.arrayContaining([
						expect.objectContaining({
							comment_id: expect.any(Number),
							body: expect.any(String),
							author: expect.any(String),
							created_at: expect.any(String),
							votes: expect.any(Number),
							article_id: expect.any(Number),
						})
					])
				)
			})
	});

	test('GET:200 should return an empty array if article has no comments', () => {
		return request(app)
			.get('/api/articles/2/comments')
			.expect(200)
			.then((response) => {
				const comments = response.body.comments;
				expect(comments).toEqual([]);
			});
	});

	test('comments should be served with the most recent comments first', () => {
		return request(app)
			.get('/api/articles/1/comments')
			.expect(200)
			.then((response) => {
				const comments = response.body.comments;
				expect(comments).toBeSortedBy('created_at', { descending: true });
			});
	});

	test('GET:400 should handle invalid article_id format', () => {
		return request(app)
			.get('/api/articles/not-an-article/comments')
			.expect(400)
			.then((response) => {
				expect(response.body.message).toBe('Invalid id');
			});
	});

	test('GET:404 should handle article not found', () => {
		return request(app)
			.get('/api/articles/999/comments')
			.expect(404)
			.then((response) => {
				expect(response.body.message).toBe('Article not found');
			});
	});
});

describe('POST /api/articles/:article_id/comments', () => {

	test('POST:201 should add a comment to the db for the given article_id', () => {
		const newComment = {
			username: 'butter_bridge',
			body: 'test comment'
		};

		return request(app)
			.post('/api/articles/1/comments')
			.send(newComment)
			.expect(201)
			.then((response) => {

				expect(response.body.comment).toEqual({
					comment_id: expect.any(Number),
					body: 'test comment',
					votes: 0,
					author: 'butter_bridge',
					article_id: 1,
					created_at: expect.any(String),
				})
			})
	});

	test('POST:404 should handle article not found', () => {
		const newComment = {
			username: 'butter_bridge',
			body: 'test comment'
		};

		return request(app)
			.post('/api/articles/999/comments')
			.send(newComment)
			.expect(404)
			.then((response) => {
				expect(response.body.message).toBe('Article not found');
			});
	});

	test('POST:400 should handle missing required fields', () => {
		const incompleteComment = {
			username: 'butter_bridge',
		};

		return request(app)
			.post('/api/articles/1/comments')
			.send(incompleteComment)
			.expect(400)
			.then((response) => {
				expect(response.body.message).toBe('Bad Request');
			});
	});

	test('POST:400 should handle missing username', () => {
		const newComment = {
			body: 'Test comment',
		};

		return request(app)
			.post('/api/articles/1/comments')
			.send(newComment)
			.expect(400)
			.then((response) => {
				expect(response.body.message).toBe('Bad Request');
			});
	});

	test('POST:400 should handle invalid article_id', () => {
		const newComment = {
			username: 'butter_bridge',
			body: 'Test comment',
		};

		return request(app)
			.post('/api/articles/banana/comments')
			.send(newComment)
			.expect(400)
			.then((response) => {
				expect(response.body.message).toBe('Invalid id');
			});
	});
	test('POST:201 should ignore extra properties in the body', () => {
		const newComment = {
			username: 'butter_bridge',
			body: 'Test comment',
			extraProp: 'ignored extra property',
		};

		return request(app)
			.post('/api/articles/1/comments')
			.send(newComment)
			.expect(201)
			.then((response) => {
				expect(response.body.comment).toEqual({
					comment_id: expect.any(Number),
					body: 'Test comment',
					votes: 0,
					author: 'butter_bridge',
					article_id: 1,
					created_at: expect.any(String),
				});
			});
	});
});

describe('PATCH /api/articles/:article_id', () => {
	test('PATCH:200 should update the votes of the given article', () => {
		const newVote = { inc_votes: 10 };

		return request(app)
			.patch('/api/articles/1')
			.send(newVote)
			.expect(200)
			.then((response) => {
				expect(response.body.article.votes).toBe(110);
			});
	})
	test('PATCH:200 should decrement the votes of the given article', () => {
		const newVote = { inc_votes: -100 };

		return request(app)
			.patch('/api/articles/2')
			.send(newVote)
			.expect(200)
			.then((response) => {
				expect(response.body.article.votes).toBe(-100);
			});
	});

	test('PATCH:200 should respond with the updated article', () => {
		const newVote = { inc_votes: 5 };

		return request(app)
			.patch('/api/articles/3')
			.send(newVote)
			.expect(200)
			.then((response) => {
				const { article } = response.body;
				expect(article).toEqual({
					article_id: 3,
					title: "Eight pug gifs that remind me of mitch",
					topic: "mitch",
					author: "icellusedkars",
					body: "some gifs",
					created_at: '2020-11-03T09:12:00.000Z',
					votes: 5,
					article_img_url: "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
				});
				expect(article.votes).toBe(5);
			});
	});

	test('PATCH:400 should handle invalid article_id', () => {
		const newVote = { inc_votes: 10 };

		return request(app)
			.patch('/api/articles/banana')
			.send(newVote)
			.expect(400)
			.then((response) => {
				expect(response.body.message).toBe('Invalid id');
			});
	});

	test('PATCH:400 should handle missing inc_votes', () => {
		const invalidVote = { votes: 10 };

		return request(app)
			.patch('/api/articles/1')
			.send(invalidVote)
			.expect(400)
			.then((response) => {
				expect(response.body.message).toBe('inc_votes is missing or invalid');
			});
	});

	test('PATCH:400 should handle if inc_votes is not a number', () => {
		const invalidVote = { inc_votes: 'not-a-number' };

		return request(app)
			.patch('/api/articles/1')
			.send(invalidVote)
			.expect(400)
			.then((response) => {
				expect(response.body.message).toBe('inc_votes must be a number');
			});
	});
});

describe('DELETE /api/comments/:comment_id', () => {
	test('DELETE:204 should return the given comment', () => {
		return request(app)
			.delete('/api/comments/1')
			.expect(204)
	});

	test('DELETE:404 should handle the situation when the comment does not exist', () => {
		return request(app)
			.delete('/api/comments/999')
			.expect(404)
			.then((response) => {
				expect(response.body.message).toBe('Comment not found');
			});
	});

	test('DELETE:400 should handle invalid comment_id', () => {
		return request(app)
			.delete('/api/comments/invalid_id')
			.expect(400)
			.then((response) => {
				expect(response.body.message).toBe('Invalid id')
			});
	});
})

