const passport=require('passport');
const LocalStrategy=require('passport-local').Strategy;
const User=require('./models/user');

passport.use(new LocalStrategy(async(username,password,done)=>{
    try{
        const user=await User.findOne({username:username});
        if(!user){
            return done(null,false,{message:"Incorrect Username"});
        }

        const isPasswordMatch=await user.comparePassword(password);
        if(!isPasswordMatch){
            return done(null,false,{message:"Incorrect password"});
        }

        return done(null,user);
    }catch(err){
        done(err);
    }
}));

passport.serializeUser((user, done) => {
    done(null, user.id);
});

// Deserialize user from session
passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (err) {
        done(err, null);
    }
});

module.exports=passport;