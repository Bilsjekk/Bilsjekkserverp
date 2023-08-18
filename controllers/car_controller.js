const Car = require('../models/Car')


const createNewCar = async (req,res) =>{
    try{
        console.log(req.body)
        const { boardNumber, privateNumber } = req.body
        const car = new Car({ boardNumber, privateNumber })
        await car.save()

        return res.status(200).send("Car Was Created")
    }catch (error){
        console.log(error.message)
        return res.status(500).send(error.message)
    }
}

const getAllCars = async (req,res) =>{
    try{
        let cars = await Car.find({})

        return res.status(200).json(cars)
    }catch (error){
        return res.status(500).send(error.message)
    }
}


const updateCar = async (req,res) =>{
    try{
        const { id } = req.params
        const { boardNumber, privateNumber } = req.body
        await Car.findOneAndUpdate({ _id: id },{
            boardNumber, privateNumber
        },{ $new: true })

        return res.status(200).send("Car Was Updated")
    }catch (error){
        return res.status(500).send(error.message)
    }
}

const deleteCar = async (req,res) =>{
    try{
        const { id } = req.params
        await Car.deleteOne({ _id: id })

        return res.status(200).send("Car Was Deleted")
    }catch (error){
        return res.status(500).json(error.message)
    }
}

const deleteAllCars = async (req,res) =>{
    try{
        await Car.deleteMany({})

        return res.status(200).send("All Cars Were Deleted")
    }catch (error){
        return res.status(500).json(error.message)
    }
}

module.exports = {
    createNewCar,
    getAllCars,
    updateCar,
    deleteCar,
    deleteAllCars
}