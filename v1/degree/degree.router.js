const {createDegree, getDegree} = require("./degree.controller")

const router = require("express").Router()


router.post("/", createDegree);
router.get("/", getDegree);

module.exports = router