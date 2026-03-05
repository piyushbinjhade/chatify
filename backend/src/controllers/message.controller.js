import cloudinary from "../lib/cloudinary.js";
import Message from "../models/Message.js";
import User from "../models/User.js";
import { getReceiverSocketId, io } from "../lib/socket.js";

  //  GET ALL CONTACTS (Not important now)
export const getAllContacts = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;

    const filteredUsers = await User.find({
      _id: { $ne: loggedInUserId },
    }).select("-password");

    res.status(200).json(filteredUsers);
  } catch (error) {
    console.log("Error in getAllContacts:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

  //  GET MESSAGES (FRIEND PROTECTED)
export const getMessageByUserId = async (req, res) => {
  try {
    const myId = req.user._id;
    const { id: otherUserId } = req.params;

    if (myId.toString() === otherUserId) {
      return res.status(400).json({ message: "Invalid chat request." });
    }

    const me = await User.findById(myId).select("friends");

    if (!me?.friends?.some(id => id.toString() === otherUserId)) {
      return res.status(403).json({
        message: "You can only view messages of your friends.",
      });
    }

    const messages = await Message.find({
      $or: [
        { senderId: myId, receiverId: otherUserId },
        { senderId: otherUserId, receiverId: myId },
      ],
    }).sort({ createdAt: 1 });

    res.status(200).json(messages);
  } catch (error) {
    console.log("Error in getMessages controller:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

  //  SEND MESSAGE (FRIEND PROTECTED)
export const sendMessage = async (req, res) => {
  try {
    const { text, image } = req.body;
    const { id: receiverId } = req.params;
    const senderId = req.user._id;

    if (!text && !image) {
      return res.status(400).json({
        message: "Text or image is required.",
      });
    }

    if (senderId.toString() === receiverId) {
      return res.status(400).json({
        message: "Cannot send message to yourself.",
      });
    }

    const receiverExists = await User.exists({ _id: receiverId });
    if (!receiverExists) {
      return res.status(404).json({ message: "Receiver not found." });
    }

    const sender = await User.findById(senderId).select("friends");

    const isFriend = sender?.friends?.some(
      (id) => id.toString() === receiverId
    );

    if (!isFriend) {
      return res.status(403).json({
        message: "You can only message your friends.",
      });
    }

    let imageUrl;
    if (image) {
      const uploadResponse = await cloudinary.uploader.upload(image);
      imageUrl = uploadResponse.secure_url;
    }

    const newMessage = new Message({
      senderId,
      receiverId,
      text,
      fileUrl: imageUrl,
      fileType: image ? "image" : undefined,
    });

    await newMessage.save();

    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", newMessage);
    }

    res.status(201).json(newMessage);

  } catch (error) {
    console.log("Error in sendMessage controller:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

  //  MARK AS SEEN
export const markMessagesAsSeen = async (req, res) => {
  try {
    const myId = req.user._id;
    const { id: otherUserId } = req.params;

    await Message.updateMany(
      {
        senderId: otherUserId,
        receiverId: myId,
        seenAt: { $exists: false },
      },
      { seenAt: new Date() }
    );

    const senderSocketId = getReceiverSocketId(otherUserId);
    if (senderSocketId) {
      io.to(senderSocketId).emit("messagesSeen", {
        by: myId,
      });
    }

    res.status(200).json({ message: "Messages marked as seen" });
  } catch (error) {
    console.log("Error in markMessagesAsSeen:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

  //  GET RECENT CHAT PARTNERS (FRIEND FILTERED)
export const getChatPartners = async (req, res) => {
  try {
    const myId = req.user._id;

    const me = await User.findById(myId).select("friends");

    const chats = await Message.aggregate([
      {
        $match: {
          $or: [{ senderId: myId }, { receiverId: myId }],
        },
      },
      {
        $addFields: {
          chatPartner: {
            $cond: [
              { $eq: ["$senderId", myId] },
              "$receiverId",
              "$senderId",
            ],
          },
        },
      },
      { $sort: { createdAt: -1 } },
      {
        $group: {
          _id: "$chatPartner",
          lastMessage: { $first: "$$ROOT" },
          unreadCount: {
            $sum: {
              $cond: [
                {
                  $and: [
                    { $eq: ["$receiverId", myId] },
                    { $not: ["$seenAt"] },
                  ],
                },
                1,
                0,
              ],
            },
          },
        },
      },
    ]);

    const populatedChats = await User.populate(chats, {
      path: "_id",
      select: "fullName username profilePic",
    });

    // FRIEND FILTER
    const filteredChats = populatedChats.filter((chat) =>
      me?.friends?.some(
        (id) => id.toString() === chat._id._id.toString()
      )
    );

    res.status(200).json(filteredChats);

  } catch (error) {
    console.error("Error in getChatPartners:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};