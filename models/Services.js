import mongoose from "mongoose";


//El servicesSchema se basa en el beatyServices que datos precisamos
const servicesSchema = mongoose.Schema({
    name: {
        type: String,
        require: true,
        trim: true
    },
    price: {
        type: Number,
        require: true,
        trim: true
    }
})

const Services = mongoose.model('Services', servicesSchema)

export default Services