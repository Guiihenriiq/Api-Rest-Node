import fastify from "fastify";
import crypto from 'node:crypto'
import { knex } from "./database"; // use the configured instance

const app = fastify();

app.get('/hello', async () => {
    const transactions = await knex('transactions')
    .where('amount',1000)
    .select('*')

    return transactions
});

app.listen({ port: 3333 }).then(() => {
    console.log('HTTP Server Running!');
    console.log('db Is Running');
});
