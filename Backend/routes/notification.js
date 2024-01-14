const notificationController = require('../controllers/notificationController');

const router = require('express').Router();

router.post('/', notificationController.createNotification);
router.get('/:id', notificationController.getNotificationByUser);
router.get('/find/:id', notificationController.getDetailNotification);
router.put('/:id', notificationController.updateNotification);

module.exports = router;
