import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import request from 'supertest'
import { app } from '../src/app'

describe('Transactions routes', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to create a new transaction', async () => {
    await request(app.server)
      .post('/transactions')
      .send({
        title: 'New transaction',
        amount: 5000,
        type: 'credit',
      })
      .expect(201)
  })

  it.todo('should be able to list all transactions', async () => {
    const createTransactionResponse = await request(app.server)
      .post('/transactions')
      .send({
        title: 'New transaction',
        amount: 5000,
        type: 'credit',
      })

    const rawCookies = createTransactionResponse.get('Set-Cookie')

    if (!rawCookies || rawCookies.length === 0) {
      throw new Error('No Set-Cookie header returned from /transactions POST')
    }


    const sessionCookie = rawCookies[0].split(';')[0]

    const listTransactionsResponse = await request(app.server)
      .get('/transactions')
      .set('Cookie', sessionCookie) // <- Agora correto
      .expect(404)

    expect(listTransactionsResponse.body.transactions).toEqual([
      expect.objectContaining({
        title: 'New transaction',
        amount: 5000,
      }),
    ])
  })

})