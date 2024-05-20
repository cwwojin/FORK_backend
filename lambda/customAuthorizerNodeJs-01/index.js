"use strict";
const jwt = require('jsonwebtoken');

const guestUser = {
    "userType": -1,
}

const splitByDelimiter = (data, delim) => {
  const pos = data ? data.indexOf(delim) : -1;
  return pos > 0 ? [data.substr(0, pos), data.substr(pos + 1)] : ["", ""];
};

const generatePolicy = (allow, payload) => {
    const policy = {
        principalId: "*",
        policyDocument: {
            Version: "2012-10-17",
            Statement: [{
                Action: "execute-api:Invoke",
                Effect: allow ? "Allow" : "Deny",
                Resource: "*",
            }],
        },
        context: payload,
    };
    return policy;
};


module.exports.handler = async (event) => {
    if(event.headers.authorization === "guest"){  // header = "guest" -> non-logged-in user
        return generatePolicy(true, guestUser);
    }
    const [type, token] = splitByDelimiter(event.headers.authorization, " ");
    try{
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        const allow = type === "Bearer" && !!payload;
        return generatePolicy(allow, payload);
    }catch(err){
        if(err.name === 'TokenExpiredError'){
            throw new Error("Unauthorized_Expired_Token");
        }else{
            return generatePolicy(false);
        }
    }
};