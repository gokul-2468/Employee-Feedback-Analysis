import { Router } from "express";
import { FeedbackRepository } from "../models/feedback";

const router = Router();

router.get("/api/feedback", async (_req, res, next) => {
  try {
    const feedback = await FeedbackRepository.getAll();
    res.json(feedback);
  } catch (error) {
    next(error);
  }
});

router.get("/api/feedback/:id", async (req, res, next) => {
  try {
    const feedback = await FeedbackRepository.getById(req.params.id);
    if (!feedback) {
      return res.status(404).json({ message: "Feedback not found" });
    }
    return res.json(feedback);
  } catch (error) {
    return next(error);
  }
});

router.post("/api/feedback", async (req, res, next) => {
  try {
    const created = await FeedbackRepository.save({
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      title: req.body.title,
      text: req.body.text,
      rating: Number(req.body.rating ?? 0),
      sentiment: req.body.sentiment || "Neutral",
      category: req.body.category || "Other",
      keyIssues: Array.isArray(req.body.keyIssues) ? req.body.keyIssues : [],
      sentimentScore: Number(req.body.sentimentScore ?? 0),
      suggestedResponse: req.body.suggestedResponse || "",
      summary: req.body.summary,
      suggestion: req.body.suggestion,
      createdAt: req.body.createdAt || new Date().toISOString()
    });

    res.status(201).json(created);
  } catch (error) {
    next(error);
  }
});

router.put("/api/feedback/:id", async (req, res, next) => {
  try {
    const updated = await FeedbackRepository.update(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ message: "Feedback not found" });
    }
    return res.json(updated);
  } catch (error) {
    return next(error);
  }
});

router.delete("/api/feedback/:id", async (req, res, next) => {
  try {
    const deleted = await FeedbackRepository.delete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: "Feedback not found" });
    }
    return res.json({ success: true });
  } catch (error) {
    return next(error);
  }
});

export default router;
