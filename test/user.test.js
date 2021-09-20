const request = require('supertest');
const app = require('../src/app');
const User = require('../src/model/user');
const { firstUserId, firstUser, populateDatabase } = require('./fixtures/db');

beforeEach(populateDatabase);

test('Should signup new user', async () => {
    const newUser = {
        name: 'Andrew',
        email: 'andrew@gmail.com',
        password: '1234567890',
    }
    const response = await request(app).post('/signup').send(newUser).expect(201);
    const user = await User.findById(response.body.user._id);
    expect(user).not.toBeNull();
    expect(response.body).toMatchObject({
        user: {
            name: newUser.name,
            email: newUser.email,
        },
        token: user.tokens[0].token
    });
    expect(user.password).not.toBe(newUser.password);
});
test('Should fail to signup an existing user', async () => {
    await request(app).post('/signup').send(firstUser).expect(500);
})

test('Should login an existing user', async () => {
    const response = await request(app).post('/login').send({
        email: firstUser.email,
        password: firstUser.password
    }).expect(200);
    const user = await User.findById(firstUserId);
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

test('Should upload an avatar picture', async () => {
    await request(app).post('/users/me/avatar')
        .set('Authorization', `Bearer ${firstUser.tokens[0].token}`)
        .attach('avatar', 'test/fixtures/profile-picture.jpg')
        .expect(202);
    const user = await User.findById(firstUserId);
    // check if the avatar propertie is a buffer
    expect(user.avatar).toEqual(expect.any(Buffer));
});

test('Should update valid fields', async () => {
    const newName = 'Bobby';
    await request(app).patch('/users/me')
        .set('Authorization', `Bearer ${firstUser.tokens[0].token}`)
        .send({ name: newName })
        .expect(200);
    const user = await User.findById(firstUserId);
    expect(user.name).toBe(newName);
});
test('Should not update invalid fields', async () => {
    await request(app).patch('/users/me')
        .set('Authorization', `Bearer ${firstUser.tokens[0].token}`)
        .send({ token: 'hack' })
        .expect(400);
});
