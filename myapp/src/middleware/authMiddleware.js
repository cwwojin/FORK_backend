const express = require('express');

module.exports = {
    /** check a requesting user's type which is in headers
     * allow access to the method if user is one of 'allowedTypes'
    */
    checkPermission: (allowedTypes) => {
        return (req,res,next) => {
            const allowed = allowedTypes.includes(Number(req.header('userType')));
            // const allowed = allowedTypes.includes(req.header('userType'));
            if(!allowed){
                return res.status(403).json({
                    status: "fail",
                    message: "User does not have permission to access this method",
                })
            }
            next();
        }
    }
}