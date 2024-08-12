import { FastifyInstance } from "fastify"
import { z } from "zod"
import { knex } from "../database"
import { randomUUID } from "crypto"

export async function transactionsRoutes(app: FastifyInstance) {
    app.post('/', async (request, reply) => {
        const createTransactionBodySchema = z.object({
            title: z.string(),
            amount: z.number(),
            type: z.enum(['credit', 'debit'])
        })

        const { title, amount, type } = createTransactionBodySchema.parse(request.body)
        // Não executa nada abaixo casa não seja validado

        await knex('transactions')
            .insert({
                id: randomUUID(),
                title,
                // Deixo as transações de débito com o valor negativo (fica mais fácil ao somar todas as transações)
                amount: type === 'credit' ? amount : amount * -1
            })

        return reply.status(201).send('Transaction crated!')

    })

}