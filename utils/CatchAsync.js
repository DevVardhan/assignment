// wraps the orignal function into a try catch block and returns err to global handeler middlewear
const catchAsync = fn =>{
    return (req , res ,next) => {
        fn(req , res , next).catch(next);
    };
};

export default catchAsync ; 