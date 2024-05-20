const mongoose = require('mongoose');

const adSchema = new mongoose.Schema({
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    price: { type: Number, required: true },
    images: [{ type: String }],
    category: { type: String, required: true, trim: true },
    condition: { type: String, required: true, trim: true },
    year: { type: Number, required: true, },
    metal: { type: String, required: true, trim: true },
    owner: { type: mongoose.Schema.Types.ObjectId, required: true },
    
}, { timestamps: true })

const AdModel = mongoose.model('Ad', adSchema);

module.exports = AdModel;


