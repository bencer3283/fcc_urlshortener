let mongoose = require('mongoose');
const dns = require('dns');

let addressSchema = mongoose.Schema({
    originalURL: {
        type: String,
        required: true,
        validate: (value) => {
            return dns.lookup(value, (err, addr, fami) => {
                if (err) return false;
                else return true;
            })
        }
    },
    proxy: {
        type: Number,
        require: true,
    }
})

module.exports = mongoose.model('Address', addressSchema);