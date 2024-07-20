export async function getBodyRequestJSON(req, res){
    const buffers = [];

    for await (const chunk of req){
        buffers.push(chunk);
    }

    try{
        /* Para entender o que está sendo feito:
        - Nativamente, a propriedade 'body' não existe. Por isso, vamos criá-la através do chunks pegos acima:
            - Primeiro vamos concatenar todos os buffers:
                - Buffer.concat(buffers);

            - Os buffers são armazenados de forma Hexadecimal, então precisamos convertê-los para string:
                - Buffer.concat(buffers).toString();

            - Feito isso, podemos converter a string para JSON, desta forma, poderemos acessar as propriedades do body:
                JSON.parse(Buffer.concat(buffers).toString());

            - Por fim, vamos atribuir tudo isso á nossa propriedade 'body':
                - req.body = JSON.parse(Buffer.concat(buffers).toString());
        
        */

        // Cria o campo "body" na request
        req.body = JSON.parse(Buffer.concat(buffers).toString());
    } catch{
        req.body = null;
    }

    res.setHeader("Content-type", "application-json");
}