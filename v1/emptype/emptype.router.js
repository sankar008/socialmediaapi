const { getEmpType } = require("./emptype.controller")


const router = require("express").Router()

router.get("/", getEmpType);

module.exports = router