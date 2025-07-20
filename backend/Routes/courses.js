const express = require('express');
const courseRouter = express.Router();
const { courseModel, purchaseModel } = require('../DB/db');
const { userMiddleware } = require('../middleware/user');
courseRouter.post('/purchase', userMiddleware, async function (req, res) {
    const userId = req.userId;
    const courseId = req.body.courseId;
    await purchaseModel.create({
        userId,
        courseId
    })
    res.json({
        message: "you purchases sucessfully"
    })
})
//to see all courses
courseRouter.get('/preview', async function (req, res) {
    const courses = await courseModel.find({

    })
    res.json({
        courses
    })
})
module.exports = {
    courseRouter: courseRouter
}