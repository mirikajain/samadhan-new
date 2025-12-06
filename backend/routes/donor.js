import express from "express";
import Donation from "../models/Donation.js";

const router = express.Router();

// SAVE DONATION
router.post("/save-donation", async (req, res) => {
  try {
    const donation = new Donation(req.body);
    await donation.save();

    res.json({
      success: true,
      message: "Donation saved successfully",
      donationId: donation._id,
    });

  } catch (err) {
    console.error("Donation Save Error:", err);
    res.status(500).json({ success: false, message: "Error saving donation" });
  }
});

// GET DONATIONS OF A DONOR
router.post("/get-donations", async (req, res) => {
  try {
    const { donorName } = req.body;

    const donations = await Donation.find({ donorName })
      .sort({ date: -1 }); // newest first

    res.json({ success: true, donations });

  } catch (err) {
    console.error("Fetch Donation Error:", err);
    res.status(500).json({ success: false, message: "Error fetching donations" });
  }
});

export default router;
