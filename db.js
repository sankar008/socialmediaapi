var mongoose = require("mongoose");
var MONGODB_URL = "mongodb://sankar008:ahpghjclqltxiryu@172.105.63.248:27017/agora?authSource=admin"
mongoose.connect(MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
	if(process.env.NODE_ENV !== "test") {
		console.log("Database connected");
	}
})
	.catch(err => {
		console.error("App starting error:", err.message);
		process.exit(1);
	});
var db = mongoose.connection; 