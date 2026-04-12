const router = require("express").Router()
const Problem = require("../models/Problem")

// Add problem
router.post("/report", async (req,res)=>{

try{
const problem = new Problem(req.body)
await problem.save()
res.json(problem)
}catch(err){
res.status(500).json(err)
}

})

// Get all problems
router.get("/all", async (req,res)=>{

try{
const problems = await Problem.find()
res.json(problems)
}catch(err){
res.status(500).json(err)
}

})

module.exports = router