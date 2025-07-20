const express = require('express');
const adminRouter = express.Router();
const bcrypt = require('bcrypt')
const { z } = require('zod');
const jwt = require('jsonwebtoken');
const JWT_ADMIN_SECRETE = "admin123"
//adminRouter.use(adminMiddleware);
const { adminModel, courseModel } = require('../DB/db');
const { adminMiddleware } = require('../middleware/admin');
adminRouter.post('/signup', async function (req, res) {
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
        const existuser = await adminModel.findOne({ email })
        if (existuser) {
            res.json({
                message: "user already exist"
            })
        }

        const hashpassword = await bcrypt.hash(password, 10);
        await adminModel.create({
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
adminRouter.post('/signin', async function (req, res) {
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
        const user = await adminModel.findOne({ email });
        if (!user) {
            res.json({
                message: "user not exist"
            })
        }
        const passwordMatch = bcrypt.compare(password, user.password);
        if (passwordMatch) {
            const token = jwt.sign({
                userId: user._id.toString()
            }, JWT_ADMIN_SECRETE);
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
adminRouter.post('/course', adminMiddleware, async function (req, res) {
    const adminId = req.adminId;
    const { title, description, imageUrl, price } = req.body;
    const course = await courseModel.create({
        title: title,
        description: description,
        imageUrl: imageUrl,
        price: price,
        creatorId: adminId
    })
    res.json({
        message: "course created",
        courseId: course._id

    })

})
adminRouter.put('/course', adminMiddleware, async function (req, res) {
    const { title, description, imageUrl, price, courseId } = req.body;
    const adminId = req.adminId
    const upadtecourse = await courseModel.updateOne({
        _id: courseId,
        creatorId: adminId
    }, {
        title: title,
        description: description,
        imageUrl: imageUrl,
        price: price,
        creatorId: adminId

    },
        { new: true })
    res.json({
        message: "course updated",
        courseId: upadtecourse._id

    })

})






adminRouter.get('/course/bulk', adminMiddleware, async function (req, res) {
    const adminId = req.adminId;
    const course = await courseModel.find({
        creatorId: adminId
    })
    res.json({
        course
    })

})
module.exports = {
    adminRouter: adminRouter
}
