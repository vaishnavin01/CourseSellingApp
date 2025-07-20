const express = require("express")
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const app = express();
const PORT = 3000;
app.use(express.json());
const { userRouter } = require('./Routes/users');
const { courseRouter } = require('./Routes/courses');
const { adminRouter } = require('./Routes/admin')
app.use('/api/v1/user', userRouter);
app.use('/api/v1/course', courseRouter);
app.use('/api/v1/admin', adminRouter)


async function main() {
    await mongoose.connect('mongodb://localhost:27017/CourseSellingApp')
    console.log('database connected');
    app.listen(3000, () => {
        console.log(`app running on port${PORT}`);
    })
}
main();