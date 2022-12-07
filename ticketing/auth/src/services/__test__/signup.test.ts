import request from 'supertest';
import { app } from '../../app';

it('returns a 201 on successful signup', async () => {
  return request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@test.com',
      password: 'validPassword',
    })
    .expect(201);
});

it('returns a 400 on invalid email during signup', async () => {
  return request(app)
    .post('/api/users/signup')
    .send({
      email: 'test',
      password: 'validPassword',
    })
    .expect(400);
});
