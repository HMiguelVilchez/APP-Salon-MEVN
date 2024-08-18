import Services from '../models/Services.js'
import { validateObjectId, handleNotFoundError } from '../utils/index.js'


const createService = async (req, res) => {
    // console.log('Desde createService')
    // console.log(req.body)
    if (Object.values(req.body).includes('')) {

        const error = new Error('Todos los campos son obligatorios')
        return res.status(400).json({
            msg: error.message
        })
    }
    try {
        const service = new Services(req.body)
        // console.log(service)
        await service.save()
        res.json({
            msg: 'El servicio se creó correctamente'
        })
    } catch (error) {
        console.log(error)
    }
}
const getServices = async (req, res) => {
    try {
        const services = await Services.find()   
        res.json(services)
    } catch (error) {
        console.log(error)
    }
}

const getServicesById = async (req, res) => {
    // console.log('Desde getServiceById')
    // console.log(req.params.id)
    const { id } = req.params

    //𝕍𝕒𝕝𝕚𝕕𝕒𝕣 𝕦𝕟 𝕠𝕓𝕛𝕖𝕔𝕥 𝕚𝕕
    if (validateObjectId(id, res)) return

    //𝕍𝕒𝕝𝕚𝕕𝕒𝕣 𝕢𝕦𝕖 𝕖𝕩𝕚𝕤𝕥𝕒
    const service = await Services.findById(id)
    // console.log(service)

    if (!service) {
        return handleNotFoundError('El servicio no existe', res)
    }

    //𝕄𝕠𝕤𝕥𝕣𝕒𝕣 𝕖𝕝 𝕤𝕖𝕣𝕧𝕚𝕔𝕚𝕠
    res.json(service)
}

const updateService = async (req, res) => {
    //console.log('desde updateService')
    const { id } = req.params

    //𝕍𝕒𝕝𝕚𝕕𝕒𝕣 𝕦𝕟 𝕆𝕓𝕛𝕖𝕔𝕥 𝕚𝕕
    if (validateObjectId(id, res)) return

    //𝕍𝕒𝕝𝕚𝕕𝕒𝕣 𝕢𝕦𝕖 𝕖𝕩𝕚𝕤𝕥𝕒
    const service = await Services.findById(id)
    // console.log(service)

    if (!service) {
        return handleNotFoundError('El servicio no existe', res)
    }

    // console.log(service)
    // console.log(id)
    // console.log(req.body)

    //𝔼𝕤𝕔𝕣𝕚𝕓𝕚𝕞𝕠𝕤 𝕖𝕟 𝕖𝕝 𝕠𝕓𝕛𝕖𝕥𝕠  𝕝𝕠𝕤 𝕧𝕒𝕝𝕠𝕣𝕖𝕤 𝕟𝕦𝕖𝕧𝕠𝕤
    service.name = req.body.name || service.name
    service.price = req.body.price || service.price

    try {
        service.save()
        res.json({
            msg: 'El servicio se actualizó correctamente'
        })
    } catch (error) {
        console.log(error)
    }
}
const deleteService = async (req, res) => {
    const { id } = req.params

    //𝕍𝕒𝕝𝕚𝕕𝕒𝕣 𝕦𝕟 𝕆𝕓𝕛𝕖𝕔𝕥 𝕚𝕕
    if (validateObjectId(id, res)) return

    //𝕍𝕒𝕝𝕚𝕕𝕒𝕣 𝕢𝕦𝕖 𝕖𝕩𝕚𝕤𝕥𝕒
    const service = await Services.findById(id)
    // console.log(service)

    if (!service) {
        return handleNotFoundError('El servicio no existe', res)
    }

    try {
        await service.deleteOne()
        res.json({
            msg: 'El Servicio ha sido eliminado'
        })
    } catch (error) {
        console.log(error)
    }
}
export {
    createService,
    getServices,
    getServicesById,
    updateService,
    deleteService
}