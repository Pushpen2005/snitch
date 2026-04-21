import { Router } from "express";
import { validateRegisterUser, validateLoginUser } from "../validator/auth.validator.js";
import { googleCallback, login, register,getMe, logout } from "../controllers/auth.controller.js";
import passport from "passport";
import { config } from "../config/config.js";
import { authenticateUser } from "../middlewares/auth.middleware.js";


const router = Router();



router.post('/register', validateRegisterUser, register)

router.post("/login", validateLoginUser, login)


// /api/auth/google
router.get("/google",
    passport.authenticate("google", { scope: [ "profile", "email" ] }))

router.get("/google/callback",
    passport.authenticate("google", {
        session: false,
        failureRedirect: config.NODE_ENV == "development" ? "http://localhost:5173/login" : "/login"
    }),
    googleCallback,
) 
router.get("/get-me", authenticateUser,getMe)

router.post("/logout", authenticateUser, logout)
export default router;