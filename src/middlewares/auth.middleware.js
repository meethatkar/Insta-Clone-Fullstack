const jwt = require("jsonwebtoken");

async function identifyUser(req, res, next){
  const token = req.cookies.jwt_token;

    if(!token){
        return res.status(401).json({
            "message": "unauthorized access"
        })
    }

    let decoded = null;
    try {
        decoded = jwt.verify(token, process.env.JWT_TOKEN)      //to verify and check which user created the post
    } catch (error) {
        return res.status(401).json({
            message: "user not authorized"
        })
    }

    req.user = decoded;
    next();
}

module.exports = identifyUser;