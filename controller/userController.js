import User from "../model/userModel.js";
import catchAsync from "../utils/CatchAsync.js";
import jwt from "jsonwebtoken";
import AppError from "../utils/appError.js";

const getToken = async id => {
    return jwt.sign({id} , process.env.JWT_SECRET , {
        expiresIn:process.env.JWT_EXPIRES , 
    }) 
}

const signupUser = catchAsync(async(req ,res , next) =>{
    const newUser  = await User.create({
        name : req.body.name ,
        gender: req.body.gender , 
        dob: req.body.dob , 
        country: req.body.counrty ,
        email : req.body.email , 
        password : req.body.password, 
        confirmPassword : req.body.confirmPassword , 
        photo : req.body.photo?req.body.photo:'noPhoto',
        username: req.body.username ,  
    })

    const token = await getToken (newUser._id) ; 

    res.status(201).json({
        status: 'Success/Created',
        message: 'New User successfully created',
        token , 
        newUser ,
    })
})


const getAllUsers = catchAsync(async(req , res ,next)=>{
    const users = await User.find();
    res.status(200).json({
        staus:'Success',
        results: users.length ,
        message:'All users mentioned',
        users ,  
    })
})

const userSingin = catchAsync(async (req , res , next) => {
    const {username , password} = req.body ; 

    if(!username || !password ){
        return next(new AppError("misisng Password/Email", 404));
    }

    const user = await User.findOne({username}).select('+password') ;
    
    if(!user || !await user.validatePassword(password , user.password)){
        return next(new AppError("Invalid email/password" , 401 ));
    }

    const token = await getToken(user._id);

    res.status(200).json({
        token , 
        message: 'sigin successfully', 
    })
    
})

const getUser = catchAsync(async (req, res, next) => {
    const { key, value } = req.params;

    // Define a valid list of keys
    const validKeys = ["id", "username", "email"];

    if (!validKeys.includes(key)) {
        return next(new AppError("Invalid search key. Use 'id', 'username', or 'email'.", 400));
    }

    const query = key === "id" ? { _id: value } : { [key]: value };

    const user = await User.findOne(query);

    if (!user) {
        return next(new AppError(`No user found with this ${key}: ${value}`, 404));
    }

    res.status(200).json({
        status: "Success",
        user,
    });
});




const isLogged = catchAsync(async(req , res , next) =>{
    let token ;
    
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        token = req.headers.authorization.split(' ')[1];
    };

    if(!token){
        return next(new AppError("User not Authorized/logged in" , 401));
    };

    const decoded = await jwt.verify(token , process.env.JWT_SECRET );

    if(!decoded || !decoded.id){
        return next(new AppError("User not Authorized/logged in" , 401));        
    };

    const currentUser = await User.findById(decoded.id);
    
    if(!currentUser){
        return next(new AppError("User not Authorized/logged in" , 401));        
    };
    
    req.currentUser = currentUser; // for patch / update attack user to request
    
    next();
})


const userController = {
    signupUser , 
    getAllUsers ,
    userSingin , 
    getUser ,
    isLogged , 
}

export default userController ;