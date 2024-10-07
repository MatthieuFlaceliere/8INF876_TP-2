import mysql from "mysql2/promise";

class DB {
    conn = null;

    async connect(host, user, password, database) {
        await this.createDB(host, user, password, database);

        this.conn = await mysql.createConnection({
            host: host,
            user: user,
            password: password,
            database: database,
        });
    }

    createDB = async (host, user, password, database) => {
        const conn = await mysql.createConnection({
            host,
            user,
            password,
        });
        conn.execute("CREATE DATABASE IF NOT EXISTS " + database);
        conn.end();
    };

    createTable = async (table, columns) => {
        if (!this.conn) {
            throw new Error("Database connection not established");
        }

        this.conn.execute(`
            CREATE TABLE IF NOT EXISTS ${table} (
                ${columns}
            );
        `);
    };

    query = async (query) => {
        if (!this.conn) {
            throw new Error("Database connection not established");
        }

        const [rows] = await this.conn.execute(query);

        return rows;
    };
}

export default DB;
