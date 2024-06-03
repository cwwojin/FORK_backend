"use strict";
const jwt = require('jsonwebtoken');

const guestUser = {
    "userType": -1,
}

/** temporary code */
const devAdmin = {
    "userType": 0,
    "accountId": "admin_01",
    "id": 3,
}
const devKAIST = {
    "userType": 1,
    "accountId": "cwwojin",
    "id": 1,
}
const devFacility = {
    "userType": 2,
    "accountId": "manager_01",
    "id": 2,
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
    const authorization = event.headers.Authorization || event.headers.authorization;
    
    /** temporary code */
    if(authorization === "foodie"){  // guest -> non-logged-in user
        return generatePolicy(true, devAdmin);
    }
    if(authorization === "kaist"){  // guest -> non-logged-in user
        return generatePolicy(true, devKAIST);
    }
    if(authorization === "facility"){  // guest -> non-logged-in user
        return generatePolicy(true, devFacility);
    }
    
    
    
    if(authorization === "guest"){  // guest -> non-logged-in user
        return generatePolicy(true, guestUser);
    }
    const [type, token] = splitByDelimiter(authorization, " ");
    try{
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        const allow = type === "Bearer" && !!payload;
        return generatePolicy(allow, payload);
    }catch(err){
        if(err.name === 'TokenExpiredError'){
            // passthrough as GUEST if 'Refresh' header exists -> to token refresh
            const refresh = event.headers.Refresh || event.headers.refresh;
            if(refresh){
                return generatePolicy(true, guestUser);
            }
            else{
                throw new Error("Unauthorized");        // only available error msg ?
            }
        }else{
            return generatePolicy(false);
        }
    }
};