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

    select(table, search) {
        let data = this.#database[table] ?? [];

        if(search){
            data = data.filter(row => {
                return Object.entries(search).some(([key, value]) => {
                    return row[key].includes(value);
                })
            })
        }

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

    delete(table, id_user){
        const rowIndex = this.#database[table].findIndex(row => row.id === id_user);

        if(rowIndex > -1){
            this.#database[table].splice(rowIndex, 1);
            this.#persistData();
        }
    }

    update(table, id, new_data){
        const rowIndex = this.#database[table].findIndex(row => row.id === id);

        if(rowIndex > -1){
            this.#database[table][rowIndex] = { id, ...new_data };
            this.#persistData();
        }
    }

}
