const router = require("express").Router();
const authController = require("../controllers/auth.controller.js");
const authmiddleware = require("../middleware/auth.middleware.js");
const validate = require("../middleware/validate.middleware.js");
const {
  registerSchema,
  loginSchema,
} = require("../validators/auth.validator.js");

router.post("/register", validate(registerSchema), authController.register);
router.post("/login", validate(loginSchema), authController.login);
router.post("/refresh", authController.refresh);
router.post("/logout", authmiddleware, authController.logout);

router.get("/me", authmiddleware, authController.me);

module.exports = router;

//TODO: now create frontend to test this refresh rotation token the create github repo and push it
