import express from "express";
import { authenticateEhr, authenticateClient } from "../middleware/auth.js";
import { v4 as uuidv4 } from "uuid";

const router = express.Router();

const isToday = (someDate) => {
  const today = new Date();
  return (
    someDate.getDate() === today.getDate() &&
    someDate.getMonth() === today.getMonth() &&
    someDate.getFullYear() === today.getFullYear()
  );
};

const cardsBuilder = (patient, lastSteps = {}) => {
  const lastStep = lastSteps.entry && lastSteps.entry[0].resource;
  return []; // TODO: Implement
};

// Respond to calling the hook
router.post("/", [authenticateEhr, authenticateClient], async (req, res) => {
  const { body, fhirClient } = req;
  const { prefetch } = body;
  const { patient, lastStepBundle } = prefetch;

  return res.status(200).json({
    cards: cardsBuilder(patient, lastStepBundle)
  });
});

export default router;
