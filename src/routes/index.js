const router = require('express').Router();
const authMiddleware = require("../middleware/auth-middleware");
const { auth } = require('../controllers');
const { handphone } = require('../controllers');

router.get('/phone/', handphone.getAllData);
router.get('/phone/:id', authMiddleware, handphone.getDetailData);
router.post('/phone/add', authMiddleware, handphone.addData);
router.post('/phone/edit', authMiddleware, handphone.editData);
router.post('/phone/delete', authMiddleware, handphone.deleteData);

router.post('/auth/login', auth.login);
router.post('/auth/register', auth.register);
router.post('/auth/token', auth.refreshToken);
router.post('/auth/delRefreshToken', auth.deleteToken);

module.exports = router;