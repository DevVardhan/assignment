import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema({
    //name
    name: {
        type: String , 
        required:[true ,'Name is required'],
    },
    // username
    username:{
        type:String , 
        required: [true , 'UserName is required'],
        unique:true , 
    },
    // dob
    dob:{
        type: Date , 
        required:[true , 'Date Of birth is required'],
    },
    // gender
    gender:{
        type:String , 
        required:[true ,'Gender is required'],
        enunm:{
            values:['M' , 'F' , 'other'],
            message: 'set gender to M/F/other',
        },
    },
    //email
    email: {
        type: String , 
        validate: [validator.isEmail, 'Enter a Valid Email Address'],
        lowercase:true ,
        unique: true ,
        required:[true ,'Name is required'],
    },
    //country
    country: {
        type: String ,
        default: 'India' ,  
    },
    //password
    password: {
        type: String , 
        select: false ,
        required:[true ,'Password is required'],
        minLength:[8,'Password length not enough (min:8characters)'], 
    },
    //confirmPassword
    confirmPassword: {
        type: String , 
        select: false , 
        required:[true ,'Password is required'],
        //Works ony on SAVE and CREATE  
        validate:[function(pass){
            return pass === this.password ;
        },`Password Dosen't match` ],
    },
    passwordChangedAt: Date , 
});

// middlewear that works before saving new user 
// Encrypts user password for security
userSchema.pre('save', async function (next) {
    // avoid rehashing the password 
    if (!this.isModified('password')) return next();
  
    // hashing password wiht salt 10 
    this.password = await bcrypt.hash(this.password, 10);
  
    // removing the confirm password field 
    this.confirmPassword = undefined;

    next();
  })
  
  // Validate the password for sigin or other fucntions
  userSchema.methods.validatePassword = function (candidatePass, userPass) {
    return bcrypt.compare(candidatePass , userPass);
  }

const User = mongoose.model('userModel',userSchema);

export default User ; 