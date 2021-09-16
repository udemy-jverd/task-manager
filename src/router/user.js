const express = require('express');
const multer = require('multer');
const { me, updateFields, deleteOne,
    getProfilePicture, uploadPicture, deletePicture } = require('../repository/user');
const auth = require('../middleware/auth');

const router = new express.Router();

const avatar = multer({
    limits: { fileSize: 1000000 },
    fileFilter(req, file, callback) {
        const regex = '\.(png|jpeg|jpg)$';
        if (!file.originalname.match(regex)) {
            return callback(new Error(`Please upload a PNG, JPEG or JPG`));
        }
        callback(null, true);
    }
});

router.get('/users/me', auth, me);
router.patch('/users/me', auth, updateFields);
router.delete('/users/me', auth, deleteOne);
router.get('/users/:id/avatar', getProfilePicture);
router.post(
    '/users/me/avatar',
    auth,
    avatar.single('avatar'),
    uploadPicture,
    (error, req, res, next) => {
        res.status(400).send({ error: error.message });
    }
);
router.delete('/users/me/avatar', auth, deletePicture);

module.exports = router;
