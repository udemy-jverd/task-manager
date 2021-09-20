const request = require('supertest');
const app = require('../src/app');
const Task = require('../src/model/task');
const { firstUser, populateDatabase } = require('./fixtures/db');

beforeEach(populateDatabase);

test('Should create a new task for user', async () => {
    const response = await request(app)
        .post('/tasks')
        .set('Authorization', `Bearer ${firstUser.tokens[0].token}`)
        .send({ description: 'Watch Ironman' }).expect(201);
    const task = await Task.findById(response.body._id);
    expect(task).not.toBeNull();
    expect(task.completed).toBe(false);
});

test('Should retrieve all tasks for a specific user', async () => {
    const response = await request(app).get('/tasks')
        .set('Authorization', `Bearer ${firstUser.tokens[0].token}`)
        .send().expect(200);
    expect(response.body.length).toBe(1);
});

// test('Should not delete a task a user does not own', async () => {
//     await request(app).delete(`/tasks/${secondTask._id}`)
//         .set('Authorization', `Bearer ${firstUser.tokens[0].token}`)
//         .send().expect(404);
// });
