const express = require('express');

module.exports = (error, req, res, next) => {
  res
    .status(error.status || 500)
    .send({ 
      name: error.name || 'Internal Server Error',
      message: error.message || 'Internal Server Error.'
    })
};