const express = require("express");
const router = express.Router();
const serverModel = require("../../models/server-model");
const userModel = require("../../models/user-model");
const isLoggedIn = require('../../middlewares/is-Logged-In');
 
router.get("/all", async (req, res) => {
  try {
    console.log('In server/all API, req.cookies is - ', req.cookies);
    const allServers = await serverModel
      .find()
      .populate(["owner", "members", "channels"]);

    if (allServers) {
      return res.json({ allServers });
    }
    return res.json({ error: "No Servers Found" });
  } catch (error) {
    console.error(error);
    return res.json({ error: "Error Occured" });
  }
});

router.post('/create', isLoggedIn, async (req, res) => {
  try {
    const { name, maxMembers } = req.body;
    const user = await userModel.findById(req.user._id);
    const server = await serverModel
      .create({
        name : name,
        owner : user._id,
        members : [user._id],
        maxMembers : maxMembers
      });
    server.populate(['owner', 'members', 'channels'])
    user.joinedServers.push(server._id);
    await user.save();

    res.json({ success: 'Server created', server});
  }catch (err) {
    console.log(err)
    res.json({ error: 'Error occured'});
  }
})



module.exports = router;
