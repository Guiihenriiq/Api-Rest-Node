import {expect, it,beforeAll, afterAll,describe   } from 'vitest'
import { createServer } from 'node:http'
import {app} from '../src/app'
import request from 'supertest'
import { after } from 'node:test'

describe('transactions routes', () =>{
    beforeAll( async()=>{
        await app.ready()
    })
    
    afterAll(async ()=>{
        app.close()
    })


const server = createServer()

it('shoud be able to create a new transaction', async ()=>{
  await request(app.server)
  .post('/transactions')
  .send({
    title: 'new transactio - Test',
    amount: 5000,
    type: 'credit'
  })
  .expect(201) 
})
})