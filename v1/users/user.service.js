  
var mongoose = require("mongoose");

var UserSchema = new mongoose.Schema({
	firstName: {type: String, required:function(){return (this.role == 'individual'?true:false)}},
	lastName: {type: String, required:function(){ return (this.role == 'individual'?true:false)}},
	userCode: {type: String, required:true},
	email: {type: String, lowercase: true, required: [true, "Email id is a required filed"]},
	company_name: { type: String, required: function(){return (this.role == 'individual'?false:true)}},
	website: { type: String },
	establishment_year: { type: Number },
	head_office_location: { type: String },
	headline: {type: String},
	branches: { type: String },
	country: { type: String },
	state: { type: String },
	city: { type: String },
	gender: {type: String, enum : ['male','female', 'other'], required: function(){return (this.role == 'individual'?true:false)}},
	address: { type: String },
	business_area: { type: String },
	mobileno: { type: String },
	role: { type: String, required: true, enum : ['company','individual'], default: 'individual'},
	image: { type: String },
	password: { type: String },
	verified: { type: String, enum : ['1','0'], default: '0' },
	username: { type: String },
	groups: {type: Array},
	educations: { type: Array},
	experiences: { type: Array},
	friends: {type: Array},
	otp: { type: String },
	postCount: {type: Number},	
	likeCount: {type: Number}
}, {timestamps: true});

UserSchema
	.virtual("fullName")
	.get(function () {
		return this.firstName + " " + this.lastName;
	});

UserSchema.index({email: 1}, {unique: true});
UserSchema.index({userCode: 1}, {unique: true});

module.exports = mongoose.model("User", UserSchema);
