const { createSkill, updateSkill, deleteSkill, getSkill } = require("./skill.controller");

const router = require('express').Router();

router.post("/", createSkill);
router.patch("/", updateSkill);
router.get("/", getSkill);
router.delete("/{id}", deleteSkill);
module.exports = router;