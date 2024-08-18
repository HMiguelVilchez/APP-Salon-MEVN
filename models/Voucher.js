import mongoose from 'mongoose';

// Esquema para el vale
const voucherSchema = new mongoose.Schema({
    //barberId: { type: mongoose.Schema.Types.ObjectId, ref: 'Barber', required: true }, // Peluquero que recibe el vale
    amount: { type: Number, required: true }, // Monto del vale
    date: { type: Date, default: Date.now },
    time: {type: String}, // Descripción opcional del vale
    description: { type: String, trim: true }
});

const Voucher = mongoose.model('Voucher', voucherSchema);

export default Voucher;