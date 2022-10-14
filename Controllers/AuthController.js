const UserModel = require("../Models/UserModel")
const bcrypt = require("bcrypt")

const jwt = require("jsonwebtoken")

//register user
const registerUser = async (req, res) => {
    const { username, password, firstname, lastname } = req.body;
    
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = new UserModel({ username, password: hashedPassword, firstname, lastname });

    try {
        const usernameExist = await UserModel.findOne({username: username});
        if(usernameExist !==null){
            res.status(400).json("username already exist!");
            return;
        }

        const user = await newUser.save();

        const token = jwt.sign(
            {
                username: user.username,
                id: user.__id
            },
            process.env.JWT_KEY,
            {
                expiresIn: "7d"
            }
        )
        res.status(200).json({user, token});
    }
    catch (err) {
        res.status(500).json({ message: err.message });
        console.log("AuthController.js -> registerUser -> " + err);
    }
}

const loginUser = async (req, res)=>{
    const {username , password} = req.body;
    try {
        const user = await UserModel.findOne({username: username});

        if(user){
            const validPass = await bcrypt.compare(password, user.password);
            if(validPass){
                const token = jwt.sign(
                    {
                        username: user.username,
                        id: user.__id
                    },
                    process.env.JWT_KEY,
                    {
                        expiresIn: "7d"
                    }
                );
                res.status(200).json({user, token});
            }
            else{
                res.status(400).json("invalid password");
            }
        }
        else{
            res.status(404).json("user not found");
        }
        

        
    } catch (err) {
        console.log("AuthController -> loginUser -> " + err);
        res.status(500).json({message: err.message});
    }
    
}

module.exports = {registerUser, loginUser}