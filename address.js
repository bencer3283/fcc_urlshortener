let mongoose = require('mongoose');
const dns = require('dns');

let addressSchema = mongoose.Schema({
    originalURL: {
        type: String,
        required: true,
    },
    proxy: {
        type: Number,
        require: true,
    }
})

module.exports = mongoose.model('Address', addressSchema);