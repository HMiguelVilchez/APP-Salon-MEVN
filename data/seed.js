import dotenv from 'dotenv'
import colors from 'colors'
import { db } from "../config/db.js"
import Services from '../models/Services.js'
import { services } from './beautyServices.js'

dotenv.config()

await db()


async function seedDB() {
    // console.log('desde seedDB')
    try {
        await Services.insertMany(services)
        console.log(colors.green.bgWhite('Se agregaron correctamente'))
        process.exit(0)
    } catch (error) {
        console.log(error)
        process.exit(1)
    }

}
async function clearDB() {
    console.log('desde clearDB')
    try {
        await Services.deleteMany()
        console.log(colors.red.bold('Se eliminaron los datos'))
        process.exit()
    } catch (error) {
        console.log(error)
        process.exit(1)
    }
}

// console.log(process.argv[2])
if (process.argv[2] === '--import') {
    seedDB()
} else {
    clearDB()
}