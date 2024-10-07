import "dotenv/config";
import express from "express";
import DB from "./db.js";

const app = express();
app.use(express.json());

const database = new DB();
await database.connect(
    process.env.DB_HOST,
    process.env.DB_USER,
    process.env.DB_PASS,
    process.env.DB_NAME
);

app.get("/", async (req, res) => {
    const rows = await database.query("SELECT * FROM messages");

    res.json(rows);
});

app.post("/", (req, res) => {
    const { message } = req.body;

    database.query(`INSERT INTO messages (message) VALUES ('${message}')`);

    res.json({ message });
});

app.listen(process.env.PORT, () => {
    console.log("Server is running on port 3000");

    database.createTable(
        "messages",
        "id INT AUTO_INCREMENT PRIMARY KEY, message TEXT"
    );
});
