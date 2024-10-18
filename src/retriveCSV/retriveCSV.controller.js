const service = require("./retriveCSV.service");

async function isRequestExist(req, res, next) {
  const { requestId = {} } = req.params; 
  const requestIdFound = await service.read(requestId); 

  if (requestIdFound) {
    res.locals.requestIdFound = requestIdFound;
    next(); 
  } else {
    return next({
      status: 404,
      message: `Invalid requestId: ${requestId}`,
    });
  }
}

function read(req, res) {
  if (res.locals.requestIdFound.status === "ready to download") {
    res.json({ data: res.locals.requestIdFound });
    
  }
  else {
    res.json({data:"Under process..."})
  }
}

module.exports = {
  read: [isRequestExist, read],
};
