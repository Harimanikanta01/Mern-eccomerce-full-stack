require('dotenv').config()
const connectDB = require('../config/db')
const bcrypt = require('bcryptjs')
const userModel = require('../models/userModel')

async function run(){
  await connectDB()
  const hashed = bcrypt.hashSync('Admin123!', 10)
  await userModel.updateOne({ email: 'admin@example.com' }, { $set: { password: hashed } })
  console.log('Admin password reset to Admin123!')
  process.exit(0)
}

run().catch(err => { console.error(err); process.exit(1) })
