var mongoose=require("mongoose"),
	passportLocal=require("passport-local-mongoose");
var userSchema=new mongoose.Schema({
    name: {
        type:String,
    },
	username:{
        type:String,
        unique:true
    },
	password:{
        type:String
        //required:true
    },
    score:{
        type:Number       //goal slayer
    },
    med_sc:{
        type:Number
    },
    kindness_sc:{       // just counter
        type:Number
    },
    share_sc:{         //just counter
        type:Number
    }
});
userSchema.plugin(passportLocal);
module.exports=mongoose.model("User",userSchema);
