const skillModule = require("./skill.service");

const createSkill = async (req, res) => {
    const body = req.body; 
    try{      
        
       if(await skillModule.find({value: body.skill}).count() == 0){
            const skillObj = new skillModule({
                value: body.skill,
                label: body.skill,
                skillCode: Math.random().toString().substr(2, 6),
        })
        const data = await skillObj.save();
        return res.status(200).json({
            success: 1,
            data: data
        })
       }else{
        return res.status(400).json({
            success: 0,
            msg: "Already exists"
        })
       }
       
    }catch(e){
        return res.status(400).json({
            success: 0,
            msg: e
        })
    }

}

const getSkill = async (req, res) => {
    try{
        const skill = await skillModule.find({})
        return res.status(200).json({
            success: 1,
            data: skill
        })
    }
    catch(e){
        return res.status(400).json({
            success: 0,
            msg: e
        })
    }
}

const updateSkill = async (req, res) => {
    const body = req.body
    try{
        if(await skillModule.find({skill: body.skill, skillCode: { $ne: body.skillCode }}) == 0){
            const skill = await skillModule.findOneAndUpdate({skillCode: body.skillCode}, {skill: body.skill})
            return res.status(200).json({
                success: 1,
                data: skill
            })
        }else{
            return res.status(400).json({
                success: 0,
                msg: "Skill already exists"
            })
        }       
    }catch(e){
        return res.status(400).json({
            success: 0,
            msg: e
        })
    }
}

const deleteSkill = async (req, res) => {
    
}


module.exports = {
    createSkill: createSkill,
    getSkill: getSkill,
    updateSkill: updateSkill,
    deleteSkill: deleteSkill
}