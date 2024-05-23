import express from 'express';
const router = express.Router()
import provisionController from '../controllers/provision.controller';

router.route("/provision")
.post(provisionController.provisionController)


export default router;
