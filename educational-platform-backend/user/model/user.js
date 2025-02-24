const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name:{ type: String, required: true },
    email: { type: String, required: true },
    password:{type: String, required: true},
    role : { type: String},
    roll_no: { type: String },
    status: { 
        type: String, 
        enum: ['active', 'inactive', 'deleted'], 
        default: 'active' 
    }
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

module.exports = User;