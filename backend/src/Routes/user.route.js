import { Router } from "express"; 
import { signup, login, logout, updateUserDetails, updateUserAvatar, deactivateAccount, getUserById, updateUserPassword } from "../Controllers/user.controller.js";
import { fileValidation, upload } from "../Middlewares/multer.js";
import { verifyJWT } from "../Middlewares/authmiddleware.js";

const router = Router()

router.route("/")
.post(upload.single("userAvatar"),fileValidation, signup)
.patch(verifyJWT, updateUserDetails)
.put(verifyJWT,upload.single("userAvatar"),fileValidation, updateUserAvatar)
.delete(verifyJWT, deactivateAccount)

router.route("/updatePassword").patch(verifyJWT, updateUserPassword)

router.route("/login").get(login)

router.route("/logout").get(verifyJWT, logout)

router.route("/:userId")
.get(getUserById)



export default router
