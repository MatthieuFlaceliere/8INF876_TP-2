import "dotenv/config";
import express from "express";
import DB from "./db.js";

const app = express(); // Create an instance of the express app
app.use(express.json()); // Parse JSON bodies for this app

// Create a new instance of the DB class and connect to the database
const database = new DB();
await database.connect(
    process.env.DB_HOST,
    process.env.DB_USER,
    process.env.DB_PASS,
    process.env.DB_NAME
);

// Read messages
app.get("/", async (req, res) => {
    const rows = await database.query("SELECT * FROM messages");

    res.json(rows);
});

// Create a new message
app.post("/", async (req, res) => {
    const { message } = req.body;

    if (!message) {
        return res.status(400).json({
            message: "Message is required",
            status: "error",
        });
    }

    await database.query(
        `INSERT INTO messages (message) VALUES ('${message}')`
    );

    res.status(201).json({
        message: "Message stored successfully",
        status: "success",
    });
});

// Update a message
app.put("/:id", async (req, res) => {
    const { id } = req.params;
    const { message } = req.body;

    if (!message) {
        return res.status(400).json({
            message: "Message is required",
            status: "error",
        });
    }

    await database.query(
        `UPDATE messages SET message = '${message}' WHERE id = ${id}`
    );

    res.json({
        message: `Message with id ${id} updated successfully`,
        status: "success",
    });
});

// Delete a message
app.delete("/:id", async (req, res) => {
    const { id } = req.params;

    await database.query(`DELETE FROM messages WHERE id = ${id}`);

    res.json({
        message: `Message with id ${id} deleted successfully`,
        status: "success",
    });
});

// Start the server
app.listen(process.env.PORT, () => {
    console.log("Server is running on port 3000");

    // Create a table if it doesn't exist
    database.createTable(
        "messages",
        "id INT AUTO_INCREMENT PRIMARY KEY, message TEXT"
    );
});
