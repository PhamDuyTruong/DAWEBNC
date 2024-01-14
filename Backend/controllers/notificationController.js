const Notification = require("../models/Notification");

const notificationController = {
    createNotification: async (req, res) => {
        const newNotification = new Notification(req.body);
        try {
            const savedNotification = await newNotification.save();
            res.status(200).json(savedNotification);
        } catch (error) {
            res.status(500).json(error);
        }
    },
    getNotificationByUser: async (req, res) => {
        try {
            const notification = await Notification.find({
                receiverId: req.params.id,
            });
            if (!notification) {
                return res.status(404).json({
                    success: false,
                    message: "Notification not found !!!",
                });
            }
            res.status(200).json(notification.sort((n1, n2) => {
                return new Date(n2.createdAt) - new Date(n1.createdAt);
            }));
        } catch (error) {
            res.status(500).json(error);
        }
    },
    getDetailNotification: async (req, res) => {
        try {
            const notification = await Notification.findById(req.params.id);
            if (!notification) {
                return res.status(404).json({
                    success: false,
                    message: "Notification not found !!!",
                });
            }
            res.status(200).json(notification);
        } catch (error) {
            res.status(500).json(error);
        }
    },
    updateNotification: async (req, res) => {
        try {
            const notification = await Notification.findByIdAndUpdate(
                req.params.id,
                {
                    $set: req.body,
                },
                { new: true }
            );
            if (!notification) {
                return res.status(404).json({
                    success: false,
                    message: "Notification not found !!!",
                });
            }
            res.status(200).json(notification);
        } catch (error) {
            res.status(500).json(error);
        }
    },
    deleteNotification: async (req, res) => {
        try {
            const notification = await Notification.findByIdAndDelete(
                req.params.id
            );
            if (!notification) {
                return res.status(404).json({
                    success: false,
                    message: "Notification not found !!!",
                });
            }
            res.status(200).json({
                success: true,
                message: "Delete notification successfully !!!",
            });
        } catch (error) {
            res.status(500).json(error);
        }
    },
};

module.exports = notificationController;