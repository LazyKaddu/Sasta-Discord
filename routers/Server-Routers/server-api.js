const express = require("express");
const router = express.Router();
const serverModel = require("../../models/server-model");
const userModel = require("../../models/user-model");

router.get("/all", async (req, res) => {
  try {
    const allServers = await serverModel
      .find()
      .populate(["owner", "members", "channels"]);

    if (allServers) {
      return res.status(200).json({ allServers });
    }
    return res.status(404).json({ message: "No Servers Found" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Error Occured" });
  }
});

module.exports = router;
