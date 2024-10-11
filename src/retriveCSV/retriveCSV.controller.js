const service = require("./retriveCSV.service");

async function isRequestExist(req, res, next) {
  const { requestId = {} } = req.params; 
  const requestIdFound = await service.read(requestId); 

  if (requestIdFound) {
    res.locals.requestIdFound = requestIdFound;
    next(); 
  } else {
    res.status(404).json({
      status: 404,
      message: `Invalid requestId: ${requestId}`,
    });
  }
}

function read(req, res) {
  res.json({ data: res.locals.requestIdFound });
}

module.exports = {
  read: [isRequestExist, read],
};
