const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const ObjectId = mongoose.Types.ObjectId;
const userSchema = new Schema({
    email: { type: String, unique: true },
    password: String,
    FirstName: String,
    LastName: String

})
const adminSchema = new Schema({
    email: { type: String, unique: true },
    password: String,
    FirstName: String,
    LastName: String

})
const courseSchema = new Schema({
    title: String,
    Description: String,
    price: Number,
    imageUrl: String,
    creatorId: ObjectId


})
const purchaseSchema = new Schema({
    userId: ObjectId,
    courseId: ObjectId

})
const userModel = mongoose.model('users', userSchema);
const adminModel = mongoose.model('admin', adminSchema);
const courseModel = mongoose.model('course', courseSchema)
const purchaseModel = mongoose.model('purchases', purchaseSchema);
module.exports = ({
    userModel: userModel,
    adminModel: adminModel,
    courseModel: courseModel,
    purchaseModel: purchaseModel
})