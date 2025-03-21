import express from "express";
import { createUser, deleteUser, getUserByEmail } from "../controllers/userController.js";

const router = express.Router();

router.post("/", createUser); 
router.get("/:email", getUserByEmail);

router.delete("/:email", deleteUser); 

export default router;
