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
				expect(response.body).toEqual(endpoints)
			})
	})
})