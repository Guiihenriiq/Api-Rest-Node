import { FastifyInstance } from "fastify";
import { z } from "zod";
import { randomUUID } from "node:crypto";
import { knex } from "../database";
import { checkSessionIdExists } from "../middleware/check-session-id-exists";



export function transactionsRoutes(app: FastifyInstance) {
    app.get('/',
        {
            preHandler: [checkSessionIdExists],
        },
        async (request, reply) => {
            const { sessionId } = request.cookies

            const transactions = await knex('transactions')
                .where('session_id', sessionId)
                .select()

            return { transactions }
        })

    app.get('/:id',
        {
            preHandler: [checkSessionIdExists],
        },
        async (request) => {
            const getTransactionsParamsSchema = z.object({
                id: z.string().uuid(),
            })

            const { id } = getTransactionsParamsSchema.parse(request.params)
            const { sessionId } = request.cookies

            const transaction = await knex('transactions')
                .andWhere('session_id', sessionId)
                .where('id', id).first()

            return { transaction }
        })

    app.get('/summary',
        {
            preHandler: [checkSessionIdExists],
        },
        async (request) => {
            const { sessionId } = request.cookies

            const summary = await knex('transactions')
                .sum('amount', { as: 'amount' })
                .where('session_id', sessionId)
                .first()

            return { summary }
        })

    app.post('/', async (request, reply) => {
        const createTransectionBodySchema = z.object({
            title: z.string(),
            amount: z.number(),
            type: z.enum(['credit', 'debit']),
        })

        const { title, amount, type } = createTransectionBodySchema.parse(
            request.body)

        let sessionId = request.cookies.sessionId

        if (!sessionId) {
            sessionId = randomUUID()

            reply.cookie('session_id', sessionId, {
                path: '/',
                maxAge: 60 * 60 * 24 * 7, //7 days from expires
            })
        }

        await knex('transactions').insert({
            id: randomUUID(),
            title,
            amount: type === 'credit' ? amount : amount * -1,
            session_id: sessionId,
        });

        return reply.status(201).send("Transaction created successfully");
    });
}