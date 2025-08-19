import { Router } from "express";
import { registerUser,logoutUser } from "../controllers/user-controller.js";
import { upload } from "../middleware/multer-middleware.js";
import { verifyJWT } from "../middleware/authmiddleware.js";

const router = Router()

router.route("/register").post(
  upload.fields([
    {
      name:  "avatar",
      maxCount:1
    },{
      name:  "coverimage",
      maxCount:1
    }
  ]),
  // fields -->to avatar and coverimg.
  registerUser)


export default router  