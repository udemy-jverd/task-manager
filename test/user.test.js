const request = require('supertest');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const app = require('../src/app');
const User = require('../src/model/user');
const { hash } = require('../src/utils/encryption');

const userOneId = new mongoose.Types.ObjectId();
const firstUser = {
    _id: userOneId,
    name: 'Test',
    email: 'test@gmail.com',
    password: '1234567890',
    tokens: [{
        token: jwt.sign({ _id: userOneId }, process.env.JWT_SECRET)
    }]
}
const secondUser = {
    name: 'Andrew',
    email: 'andrew@gmail.com',
    password: '1234567890'
}

beforeEach(async () => {
    await User.deleteMany();
    const user = await new User(firstUser);
    user.password = await hash(firstUser.password);
    user.save();
});

test('Should signup new user', async () => {
    const response = await request(app).post('/signup').send(secondUser).expect(201);
    const user = await User.findById(response.body.user._id);
    expect(user).not.toBeNull();
    expect(response.body).toMatchObject({
        user: {
            name: secondUser.name,
            email: secondUser.email,
        },
        token: user.tokens[0].token
    });
    expect(user.password).not.toBe(secondUser.password);
});
test('Should fail to signup an existing user', async () => {
    await request(app).post('/signup').send(firstUser).expect(500);
})

test('Should login an existing user', async () => {
    const response = await request(app).post('/login').send({
        email: firstUser.email,
        password: firstUser.password
    }).expect(200);
    const user = await User.findById(userOneId);
    expect(response.body.token).toBe(user.tokens[1].token);
});
test('Should not login a non-existing user', async () => {
    await request(app).post('/login').send({
        email: 'random@protonmail.com',
        password: firstUser.password
    }).expect(400);
});
test('Should not login an existing user with a wrong password',
    async () => {
        await request(app).post('/login').send({
            email: firstUser.email,
            password: 'wrong'
        }).expect(400);
    }
);

test('Should get the user profile', async () => {
    await request(app).get('/users/me')
        .set('Authorization', `Bearer ${firstUser.tokens[0].token}`)
        .send()
        .expect(200);
});
test('Should not get the user profile whitout bearer', async () => {
    await request(app).get('/users/me').send().expect(401);
});

test('Should delete account for user', async () => {
    await request(app).delete('/users/me')
        .set('Authorization', `Bearer ${firstUser.tokens[0].token}`)
        .send()
        .expect(204);
    const user = await User.findById(firstUser._id);
    expect(user).toBeNull();
});
test('Should not delete account for user without bearer', async () => {
    await request(app).delete('/users/me').send().expect(401);
});
