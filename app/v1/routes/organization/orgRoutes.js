import express from "express";

const router = express.Router();


router.post("/create-vessel", (req, res) => {
    res.status(201).json({ test: "Test" });
});

export default router;