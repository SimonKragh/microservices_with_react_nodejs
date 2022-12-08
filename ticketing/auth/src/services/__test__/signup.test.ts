import { response } from 'express';
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

it('returns a status of 400 on invalid email during signup', async () => {
  return request(app)
    .post('/api/users/signup')
    .send({
      email: 'test',
      password: 'validPassword',
    })
    .expect(400);
});

it('returns a status of 400 on password that does not match criterias (length) during signup', async () => {
  return request(app)
    .post('/api/users/signup')
    .send({
      email: 'valid@email.com',
      password: '123',
    })
    .expect(400);
});

it('returns a status of 400 if email or password is empty', async () => {
  await request(app)
    .post('/api/users/signup')
    .send({
      email: 'valid@email.com',
    })
    .expect(400);

  await request(app)
    .post('/api/users/signup')
    .send({
      password: 'validPassword',
    })
    .expect(400);
});

it('Disallows duplicate emails. e.g. the email is our primary business key.', async () => {
  await request(app)
    .post('/api/users/signup')
    .send({
      email: 'valid@email.com',
      password: 'validPassword',
    })
    .expect(201);

  await request(app)
    .post('/api/users/signup')
    .send({
      email: 'valid@email.com',
      password: 'validPassword',
    })
    .expect(400);
});

it('sets a cookie on the client after a successful signup', async () => {
  const response = await request(app)
    .post('/api/users/signup')
    .send({
      email: 'valid@email.com',
      password: 'validPassword',
    })
    .expect(201);

  expect(response.get('Set-Cookie')).toBeDefined();
});
