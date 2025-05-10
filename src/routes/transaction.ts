import { FastifyInstance } from "fastify";
import { z } from "zod";
import { randomUUID } from "node:crypto";
import { knex } from "../database";
import { Tables } from "knex/types/tables";


export function transactionsRoutes(app:FastifyInstance){
    app.post('/', async (request,reply) => {
        const createTransectionBodySchema = z.object({
            title: z.string(),
            amount: z.number(),
            type: z.enum(['credit', 'debit']),
        }) 

        const {title,amount,type} = createTransectionBodySchema.parse(
            request.body)

            await knex('transactions')
            .insert({
                id: randomUUID(),
                title,
                amount: type === 'credit' ? amount : amount *-1,
            })

        return reply.status(201).send("Transaction Vary GoodS")
    });
}