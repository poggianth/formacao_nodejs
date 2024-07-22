import fs from "node:fs/promises";

const databasePath = new URL("../db.json", import.meta.url);

export class Database {
  #database = {};

  constructor() {
    fs.readFile(databasePath, "utf8")
      .then((data) => {
        this.#database = JSON.parse(data);
      })
      .catch(() => {
        this.#persistData();
      });
  }

  #persistData() {
    fs.writeFile(databasePath, JSON.stringify(this.#database));
  }

  select(table, idSearch) {
    let data = this.#database[table] ?? {};

    if (idSearch) {
      data = data.filter((row) => {
        if (row.id == idSearch) {
            return data;
        }
      });
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

  delete(table, idTask) {
    const indexTaskDB = this.#database[table].findIndex(
        (row) => row.id === idTask
    );

    if (indexTaskDB > -1) {
      this.#database[table].splice(indexTaskDB, 1);
      this.#persistData();
    }
  }

  update(table, id, newData) {
    const indexTaskDB = this.#database[table].findIndex(
        (row) => row.id === id
    );

    if (indexTaskDB > -1) {
      const row = this.#database[table][indexTaskDB];
      this.#database[table][indexTaskDB] = { id, ...row, ...newData };
      this.#persistData();
    }
  }
}
