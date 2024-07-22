import fs from "node:fs";
import { parse } from "csv-parse";

const stream = fs.createReadStream("./csv_desafio_01.csv");

const csvParser = parse({
    skip_empty_lines: true,
    from_line: 2, // Começa a partir da segunda linha (pula o cabeçalho)
    delimiter: ","
});

async function readFile(){
    const linesParse = stream.pipe(csvParser);
    
    for await (const line of linesParse){
        const title = line[0];
        const description = line[1];

        await fetch("http://localhost:3000/tasks", {
            method: "POST",
            body: JSON.stringify({
                title,
                description
            })
        })
    }
}

readFile();