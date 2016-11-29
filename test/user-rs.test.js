const app = require('../app');
const request = require('supertest').agent(app.listen());
const assert = require('chai').assert
  

describe('User CRUD', () => {
    it('findAll', (done) => {
        request.get('/api/users')
            .expect(res => {
                assert.equal(res.body.length, 3);
            })
            .expect(200,done);
    });
});