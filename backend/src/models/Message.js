import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    receiverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Text message
    text: {
      type: String,
      trim: true,
      maxlength: 5000,
    },

    // Media
    fileUrl: {
      type: String,
    },

    fileType: {
      type: String,
      enum: ["image", "video", "audio", "document"],
    },

    // Status
    deliveredAt: Date,
    seenAt: Date,

    // Edit/Delete
    isDeleted: {
      type: Boolean,
      default: false,
    },

    isEdited: {
      type: Boolean,
      default: false,
    },

    editedAt: Date,
  },
  { timestamps: true }
);

// Add indexes for query optimization
messageSchema.index({ senderId: 1, receiverId: 1, createdAt: -1 });
messageSchema.index({ senderId: 1, createdAt: -1 });
messageSchema.index({ receiverId: 1, createdAt: -1 });

export default mongoose.model("Message", messageSchema);