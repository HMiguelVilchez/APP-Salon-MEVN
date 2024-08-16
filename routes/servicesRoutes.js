import express from 'express'
import { createService, getServices, getServicesById, updateService, deleteService } from '../controllers/servicesController.js'


const router = express.Router()
//Definir ruta
// router.post('/', createService)
// router.get('/', getServices)
router.route('/')
    .post(createService)
    .get(getServices)

router.route('/:id')
    .get(getServicesById)
    .put(updateService)
    .delete(deleteService)
// router.get('/:id', getServicesById)
// router.put('/:id', updateService)
// router.delete('/:id', deleteService)

export default router