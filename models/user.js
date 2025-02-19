const mongoose=require('mongoose');
const bcrypt=require('bcrypt');

const userSchema=new mongoose.Schema({
    full_name:{
        type:String,
        required:true,
        trim:true
    },

    username:{
        type:String,
        required:true,
        unique:true,
        trim:true
    },

    password:{
        type:String,
        required:true
    },

    phone:{
        type:String,
        required:true,
        unique:true,
        trim:true
    }
});

userSchema.pre('save', async function(next){
    const user=this;
    if(!user.isModified('password')) return next();

    try{
        const salt=await bcrypt.genSalt(10);
        const hashedPassword=await bcrypt.hash(user.password,salt);
        user.password=hashedPassword;
        next();
    }catch(err){
        next(err);
    }
});

userSchema.methods.comparePassword=async function(candidaatePassword){
    try{
        const isMatch=await bcrypt.compare(candidaatePassword,this.password);
        return isMatch;
    }catch(err){
        throw err;
    }
}

const User=mongoose.model('User',userSchema);

module.exports=User;