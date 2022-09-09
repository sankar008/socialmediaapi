const getEmpType = (req, res) => {
    return res.status(200).json({
        success: 1,
        data:[{name: "Full time"}, {name: "Part time"}, {name: "Self employer"}, {name: "Freelance"}, {name: "Intership"}, {name: "Trainee"}]
    })
}

module.exports = {
    getEmpType: getEmpType
}