import 'dotenv/config'
import { never, z } from 'zod'

// Precisamos informar o formato de dados de cada variável de ambientes

const envSchema = z.object({
    NODE_ENV: z.enum(['development', 'teste', 'production']).default('production'),
    DATABASE_URL: z.string(),
    PORT: z.number().default(3333),
})

// Vai dentro do 'process.env' e procura pelas variáveis informadas acima e valida se é do tipo que informamos
const _env = envSchema.safeParse(process.env)

if(_env.success === false){
    console.error('Invalid environment variables!\n', _env.error.format())

    throw new Error('Invalid environment variables!')
}

export const env = _env.data