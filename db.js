const mongoose=require('mongoose');
require('dotenv').config();

const mongoURL=process.env.MONGODB_LOCAL_URL;

mongoose.connect(mongoURL).then(()=>{
    console.log('Connected to MongoDB');
}).catch(err => console.error('MongoDB connection error:',err));

const db=mongoose.connection;

db.on('error',err => console.log("MongoDB error:",err));
db.on('disconnected',()=> console.log('Disconnected to mongoDB'));

process.on('SIGINT',async()=>{
    await mongoose.connection.close();
    console.log('MongoDB Closed');
    process.exit(0);
});

module.exports=db;