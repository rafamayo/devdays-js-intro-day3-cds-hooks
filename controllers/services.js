import express from "express";

const router = express.Router();

const prefetch = {}; // TODO: Implement!

const stepService = {
  hook: "patient-view",
  id: "steps",
  title: "Patient daily steps",
  description: "A CDS service for daily steps.",
  prefetch
};

// CDS Hooks service endpoint
router.get("/", async (req, res) =>
  res.status(200).json({
    services: [stepService]
  })
);

export default router;
