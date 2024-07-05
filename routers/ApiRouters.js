const express = require("express");
const router = express.Router();
const userModel = require("../models/user-model");

router.get("/get-user", async (req, res) => {
  try {
    const user = await userModel.findById(req.session.passport.user);
    if (!user) {
      return res.status(404).json({ error: "No User Found!" });
    }
    return res.status(200).json(user);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/get-user/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const user = await userModel.findById(id);
    if (user) {
      return res.status(200).json(user);
    }
    return res.status(404).json({ error: "No User Found!" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
