const {createindustryType, getindustryType} = require("./industrytype.controller")

const router = require("express").Router()


router.post("/", createindustryType);
router.get("/", getindustryType);

module.exports = router