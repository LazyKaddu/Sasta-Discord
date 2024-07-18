const express = require("express");
const router = express.Router();
const serverModel = require("../../models/server-model");
const userModel = require("../../models/user-model");
const isLoggedIn = require('../../middlewares/is-Logged-In');
 
router.get("/all", isLoggedIn, async (req, res) => {
  try {
    // console.log('In server/all API, req.cookies is - ', req.cookies);
    const allServers = await serverModel
      .find()
      .populate(["owner", "members"]);

    if (allServers) {
      return res.json({ allServers });
    }
    return res.json({ error: "No Servers Found" });
  } catch (error) {
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
    server.populate(['owner', 'members'])
    user.joinedServers.push(server._id);
    await user.save();

    res.json({ success: 'Server created', server});
  }catch (err) {
    res.json({ error: 'Error occured'});
  }
})

router.post('/join', isLoggedIn, async(req, res)=>{
  try{
    const {serverId} = req.body;
    const user = await userModel.findById(req.user._id);
    const server = await serverModel.findById(serverId);

    // if user has already joined, then remove
    if (server.members.includes(user._id)) {
      server.members.splice(user._id, 1);
      user.joinedServers.splice(server._id, 1);
      await user.save();
      await server.save();
      return res.json({failure : true})
    }
    // if user has not joined, add him
    else {
      server.members.push(user._id);
      user.joinedServers.push(server._id);
      await user.save();
      await server.save();
      return res.json({success : true})
    }
  }catch(err){
    res.json({ error: true });
  }
})

router.get('/get-joined-status', isLoggedIn, async (req, res) => {
  const { serverId } = req.query;
  let server = await serverModel.findById(serverId);
  return res.json({ is_joined : server.members.includes(req.user._id) })
})

module.exports = router;
