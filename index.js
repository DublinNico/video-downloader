import dotenv from "dotenv";
dotenv.config();

const express = require('express')
const path = require("path")
const fs = require("fs")
const { execFile } = require("child_process")
const { getJson } = require("serpapi")
const apiKey = process.env.API_KEY;

const app = express()
const PORT = 3000
const DOWNLOADS_DIR = path.join(__dirname, "downloads")

if (!fs.existsSync(DOWNLOADS_DIR)) {
    fs.mkdirSync(DOWNLOADS_DIR)
}

app.use(express.json())
app.use(express.static(path.join(__dirname, "public")))
app.use("/downoads", express.static(DOWNLOADS_DIR))

app.use("/api", (req, res, next) => {
    const key = req.headers["x-api-key"];
    if (key !== process.env.API_KEY) {
        return res.status(401).json({ error: "Unauthorised "});
    }
    next();
});

app.get("/api/search", (req, res) => {
    const { q, count = 5 } = req.query

    if (!q) {
        return res.status(400).json({ error: "Query paramater 'q' is required"})
    }

    getJson({
        engine: "google_short_videos",
        q,
        api_key: process.env.API_KEY
    }, (json) => {
        const videos = (json.short_video_results || []).slice(0, parseInt(count))
        res.json({ videos })
    })
})

 app.listenerCount(PORT, () => {
        console.log(`Server running at http:localhost:${PORT}`)
    })