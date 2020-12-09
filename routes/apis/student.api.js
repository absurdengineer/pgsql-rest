const express = require('express')
const Joi = require('joi')
const pool = require('../../databases/db')
const router = express.Router()

const studentSchema = Joi.object({
    firstname : Joi.string().min(2).max(255).required(),
    lastname : Joi.string().min(2).max(255),
    email : Joi.string().email().required(),
    mobile : Joi.number().min(6000000000).max(9999999999).required(),
    marks : Joi.number().min(0).max(1000).required()
})

const validateStudent = student => {
    return studentSchema.validate(student)
}

router.get('/',async (req, res) => {
    try{
        const result = await pool.query('SELECT * FROM students')
        return res.status(200).json(result.rows)
    }catch(error) {
        console.error(`Error : ${error.message}`)
    }
})
router.get('/:id',async (req, res) => {
    try{
        const id = parseInt(req.params.id)
        const result = await pool.query(`SELECT * FROM students WHERE id=${id};`)
        if(!result.rows[0])
            res.status(404).send("Invalid Id")
        return res.status(200).json(result.rows[0])
    }catch(error) {
        console.error(`Error : ${error.message}`)
    }
})
router.post('/',async (req, res) => {
    try{
        const {error} = validateStudent(req.body)
        if(error) return res.status(400).send(error.message)
        const {id, firstname, lastname, email, mobile, marks } = req.body
        const result = await pool.query(`INSERT INTO students VALUES(DEFAULT, '${firstname}', '${lastname}', '${email}', '${mobile}', '${marks}') RETURNING *;`)
        return res.status(200).json(result.rows[0])
    }catch(error) {
        console.error(`Error : ${error.message}`)
    }
})
router.put('/:id',async (req, res) => {
    try{
        const id = parseInt(req.params.id)
        let result = await pool.query(`SELECT * FROM students WHERE id=${id};`)
        if(!result.rows[0])
            res.status(404).send("Invalid Id")
        const {error} = validateStudent(req.body)
        if(error) return res.status(400).send(error.message)
        const {firstname, lastname, email, mobile, marks } = req.body
        result = await pool.query(`UPDATE students SET firstname='${firstname}', lastname='${lastname}', email='${email}', mobile='${mobile}', marks='${marks}' WHERE id=${id} RETURNING *;`)
        return res.status(200).json(result.rows[0])
    }catch(error) {
        console.error(`Error : ${error.message}`)
    }
})
router.delete('/:id', async (req, res) => {
    try{
        const id = parseInt(req.params.id)
        let result = await pool.query(`SELECT * FROM students WHERE id=${id};`)
        if(!result.rows[0])
            res.status(404).send("Invalid Id")
        result = await pool.query(`DELETE FROM students WHERE id=${id} RETURNING *;`)
        return res.status(200).json(result.rows[0])
    }catch({message}){
        console.error(`Error : ${message}`)
    }
})

module.exports = router