import User from "../models/User.js";
import FriendRequest from "../models/FriendRequest.js";


//  SEARCH USERS BY USERNAME
export const searchUsers = async (req, res) => {
  try {
    const { username } = req.query;
    const currentUserId = req.user._id;

    if (!username || username.trim() === "") {
      return res.status(400).json({ message: "Username required" });
    }

    const users = await User.find({
      username: { $regex: username, $options: "i" },
      _id: { $ne: currentUserId },
    }).select("_id username fullName profilePic");

    res.status(200).json(users);
  } catch (error) {
    console.error("Search users error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// SEND FRIEND REQUEST
export const sendFriendRequest = async (req, res) => {
  try {
    const senderId = req.user._id;
    const { userId } = req.params;

    if (senderId.toString() === userId) {
      return res.status(400).json({ message: "Cannot send request to yourself" });
    }

    const receiver = await User.findById(userId);
    if (!receiver) {
      return res.status(404).json({ message: "User not found" });
    }

    // Already friends?
    const sender = await User.findById(senderId);
    if (sender.friends.includes(userId)) {
      return res.status(400).json({ message: "Already friends" });
    }

    // Already sent request?
    const existingRequest = await FriendRequest.findOne({
      sender: senderId,
      receiver: userId,
    });

    if (existingRequest) {
      return res.status(400).json({ message: "Request already sent" });
    }

    await FriendRequest.create({
      sender: senderId,
      receiver: userId,
    });

    res.status(201).json({ message: "Friend request sent" });

  } catch (error) {
    console.error("Send friend request error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// GET PENDING REQUESTS (INCOMING)
export const getPendingRequests = async (req, res) => {
  try {
    const userId = req.user._id;

    const requests = await FriendRequest.find({
      receiver: userId,
      status: "pending",
    })
      .populate("sender", "_id username fullName profilePic")
      .sort({ createdAt: -1 });

    res.status(200).json(requests);

  } catch (error) {
    console.error("Get requests error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// ACCEPT REQUEST
export const acceptFriendRequest = async (req, res) => {
  try {
    const userId = req.user._id;
    const { requestId } = req.params;

    const request = await FriendRequest.findById(requestId);

    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    if (request.receiver.toString() !== userId.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    // Add both users to each other's friend list
    await User.findByIdAndUpdate(request.sender, {
      $addToSet: { friends: request.receiver },
    });

    await User.findByIdAndUpdate(request.receiver, {
      $addToSet: { friends: request.sender },
    });

    await FriendRequest.findByIdAndDelete(requestId);

    res.status(200).json({ message: "Friend request accepted" });

  } catch (error) {
    console.error("Accept request error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// REJECT REQUEST
export const rejectFriendRequest = async (req, res) => {
  try {
    const userId = req.user._id;
    const { requestId } = req.params;

    const request = await FriendRequest.findById(requestId);

    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    if (request.receiver.toString() !== userId.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await FriendRequest.findByIdAndDelete(requestId);

    res.status(200).json({ message: "Friend request rejected" });

  } catch (error) {
    console.error("Reject request error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// GET FRIEND LIST
export const getFriends = async (req, res) => {
  try {
    const userId = req.user._id;

    const user = await User.findById(userId)
      .populate("friends", "_id username fullName profilePic");

    res.status(200).json(user.friends);

  } catch (error) {
    console.error("Get friends error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};