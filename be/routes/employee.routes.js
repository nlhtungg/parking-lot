const express = require("express");
const router = express.Router();

const employeeController = require("../controllers/employee.controller");
const notiController = require("../controllers/admin.noti.controller");
const sessionsController = require("../controllers/employee.sessions.controller");
const lotsController = require("../controllers/admin.lots.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const monitorController = require("../controllers/employee.monitor.controller");
const profileController = require("../controllers/employee.profile.controller");

router.use(authMiddleware.isAuthenticated, authMiddleware.hasRole(["employee"]));

router.get("/", employeeController.getDashboard);

router.get("/monitor", monitorController.getMyLot);
router.get("/monitor/sessions", monitorController.getMyParkingSessions);

router.get("/notifications", notiController.getAllNotifications);
router.get("/notifications/:id", notiController.getNotificationById);

// Parking lots route
router.get("/parking-lots", lotsController.getAllParkingLots);

// Parking sessions routes
router.get("/parking-sessions", sessionsController.getActiveSessions);
router.post("/parking-sessions", sessionsController.checkInVehicle);

// New entry/exit API endpoints
router.post("/parking/entry", sessionsController.checkInVehicle);
router.get("/parking/exit/:session_id", sessionsController.initiateCheckout);
router.post("/parking/exit/confirm", sessionsController.confirmCheckout);

// Profile routes
router.get("/profile", profileController.getMyProfile);
router.put("/profile", profileController.updateMyProfile);

module.exports = router;
