const express = require('express');
const bcrypt = require('bcrypt')
const { z } = require('zod');
const jwt = require('jsonwebtoken');
const userRouter = express.Router();
const { userModel, purchaseModel, courseModel } = require('../DB/db');
const { userMiddleware } = require('../middleware/user');
const JWT_USER_SECRETE = "user123"

userRouter.post('/signup', async function (req, res) {
    const requireBody = z.object({
        email: z.string().min(3).max(100).email(),
        password: z.string().min(3).max(100),
        FirstName: z.string().min(2).max(100),
        LastName: z.string().min(2).max(100)

    })
    const parsed = requireBody.safeParse(req.body);
    if (!parsed.success) {
        res.status(400).json({
            message: "incorrect format",
            error: parsed.error
        })
    }
    const { email, password, FirstName, LastName } = req.body;
    try {
        const existuser = await userModel.findOne({ email })
        if (existuser) {
            res.json({
                message: "user already exist"
            })
        }

        const hashpassword = await bcrypt.hash(password, 10);
        await userModel.create({
            email: email,
            password: hashpassword,
            FirstName: FirstName,
            LastName: LastName

        })
        res.json({
            message: "user sign up"
        })

    } catch (e) {
        res.status(500).json({
            message: "something went wrong",
            error: e.message
        })
    }

})
//user signin endpoint
userRouter.post('/signin', async function (req, res) {
    const requireBody = z.object({
        email: z.string().min(3).max(100).email(),
        password: z.string().min(3).max(100)
    })
    const parsed = requireBody.safeParse(req.body);
    if (!parsed.success) {
        res.json({
            message: "incorrect format",
            error: parsed.error
        })
    }
    const { email, password } = req.body;
    try {
        const user = await userModel.findOne({ email });
        if (!user) {
            res.json({
                message: "user not exist"
            })
        }
        const passwordMatch = bcrypt.compare(password, user.password);
        if (passwordMatch) {
            const token = jwt.sign({
                userId: user._id.toString()
            }, JWT_USER_SECRETE);
            console.log("Token", token);
            res.json({
                message: "user sign in",
                token: token
            })

        }
        else {
            res.status(403).json({
                message: "invalid credentials"
            })
        }

    } catch (e) {
        res.status(500).json({
            message: "something went wrong",
            error: e.message
        })
    }

})
//user see their purchase courses
userRouter.get('/purchase', userMiddleware, async function (req, res) {
    const userId = req.userId;

    const purchases = await purchaseModel.find({ userId });

    const courseIds = purchases.map(p => p.courseId);
    const courseData = await courseModel.find({ _id: { $in: courseIds } });

    res.json({
        purchasedCourses: courseData
    });
});

module.exports = {
    userRouter: userRouter
}