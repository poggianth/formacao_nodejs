import fs from "node:fs/promises";


const databasePath = new URL('../db.json', import.meta.url);

export class Database {
    // O (#) torna o atributo ou método PRIVADO
    #database = {};

    constructor() {
        fs.readFile(databasePath, 'utf8').then(data => {
            this.#database = JSON.parse(data)
        }).catch(() => {
            // cria o banco caso o arquivo NÃO exista
            this.#persistData();
        })
    }

    #persistData() {
        fs.writeFile(databasePath, JSON.stringify(this.#database));
    }

    select(table) {
        const data = this.#database[table] ?? [];

        return data;
    }

    insert(table, data) {
        if (Array.isArray(this.#database[table])) {
        this.#database[table].push(data);
        } else {
        this.#database[table] = [data];
        }

        this.#persistData();
        return data;
    }
}
