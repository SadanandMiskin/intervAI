import express from 'express'
import { createInterv } from '../controllers/interv'
const r = express.Router()

r.post('/create' , (req, res, next)=> {
  try {
    createInterv(req, res, next)
  } catch (error) {
    next(error)
  }
})

export default r