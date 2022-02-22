const supertest = require('supertest');
const app = require("../../src/app");

const req = supertest(app);
require('../../src/routes');

it('GET /admin/best-profession should return the best profession', async () => {
    const res = await req.get('/admin/best-profession');
    // .set({profile_id: 1});

    expect(res.status).toEqual(200);
    expect(res.type).toEqual('application/json');
    expect(res.body).toHaveProperty('bestProfession')
});

it('GET /admin/best-profession?start=2020-01-01 should return the best profession', async () => {
    const res = await req.get('/admin/best-profession?start=2020-01-01');

    expect(res.status).toEqual(200);
    expect(res.type).toEqual('application/json');
    expect(res.body).toHaveProperty('bestProfession')
});

it('GET /admin/best-profession?end=2030-01-01 should return the best profession', async () => {
    const res = await req.get('/admin/best-profession?start=2030-01-01');

    expect(res.status).toEqual(200);
    expect(res.type).toEqual('application/json');
    expect(res.body).toHaveProperty('bestProfession')
});

it('GET /admin/best-profession?start=2020-01-01&end=2030-01-01 should return the best profession', async () => {
    const res = await req.get('/admin/best-profession?start=2030-01-01');

    expect(res.status).toEqual(200);
    expect(res.type).toEqual('application/json');
    expect(res.body).toHaveProperty('bestProfession')
});

it('GET /admin/best-profession?start=2020-13-01 should not allow invalid start date', async () => {
    const res = await req.get('/admin/best-profession?start=2020-13-01');

    expect(res.status).toEqual(400);
    expect(res.type).toEqual('application/json');
    expect(typeof res.body === 'object');
});

it('GET /admin/best-profession?end=2020-13-01 should not allow invalid end date', async () => {
    const res = await req.get('/admin/best-profession?end=2020-13-01');

    expect(res.status).toEqual(400);
    expect(res.type).toEqual('application/json');
    expect(typeof res.body === 'object');
});
