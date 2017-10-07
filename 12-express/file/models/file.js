var mongoose = require('mongoose');

// 定义Schema
FileSchema = new mongoose.Schema({
    filename: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    path: {
        type: String
    },
    public: {
        type: Boolean,
        default: false 
    }
});

// 定义Model
var FileModel = mongoose.model('File', FileSchema);

// 暴露接口
module.exports = FileModel;