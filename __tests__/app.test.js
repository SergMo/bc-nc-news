const app = require('../app');
const request = require('supertest');
const db = require('../db/connection');
const seed = require('../db/seeds/seed');
const data = require('../db/data/test-data/') //?
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

	test('GET:400 should handle invalid article_id format', () => {
		return request(app)
			.get('/api/articles/not-an-article')
			.expect(400)
			.then((response) => {
				expect(response.body.message).toBe('Invalid article_id');
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
	test('comments should be served with the most recent comments first', () => {
		return request(app)
			.get('/api/articles/1/comments')
			.expect(200)
			.then((response) => {
				const comments = response.body.comments;
				console.log(comments);
				expect(comments).toBeSortedBy('created_at', { descending: true });
			});
	});

	test('GET:400 should handle invalid article_id format', () => {
		return request(app)
			.get('/api/articles/not-an-article/comments')
			.expect(400)
			.then((response) => {
				expect(response.body.message).toBe('Invalid article_id');
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
})