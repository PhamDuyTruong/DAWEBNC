const moogoose = require("mongoose");

const notificationSchema = new moogoose.Schema(
  {
    senderId: {
      type: moogoose.Schema.Types.ObjectId,
      ref: "User",
    },
    receiverId: [
      {
        type: moogoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    image: {
      type: String,
      default: "",
    },
    type: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    detailPage: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = moogoose.model("Notification", notificationSchema);
