const http = require("http");
const { parse } = require("url");
const {
  getAllUsers,
  createUser,
  getOneUser,
  updateOneUser,
  patchOnUser,
  deleteOneUser,
} = require("./users");
const {
    getAllDrinks,
    createDrink,
    getOneDrink,
    updateOneDrink,
    deleteOneDrink,
    patchOnDrink,
} = require("./drinks");
const { writeJson } = require("./utils");

http
  .createServer(function (req, res) {
    handleDataRequest(req, res);
  })
  .listen(8080);
console.log("Listening on port 8080");

function throw404(res) {
  writeJson(res, { status: "Resource not found" }, 404);
}

function handleDataRequest(req, res) {
  const { pathname } = parse(req.url);
  const { method } = req;
  if (pathname === "/users") {
    if (method === "GET") {
      return getAllUsers(req, res);
    } else if (method === "POST") {
      return createUser(req, res);
    }
  } else if (pathname.startsWith('/users') && pathname.split("/").length === 3) {
    switch (method.toLowerCase()) {
      case "get":
        return getOneUser(req, res);
      case "put":
        return updateOneUser(req, res);
      case "patch":
        return patchOnUser(req, res);
      case "delete":
        return deleteOneUser(req, res);
      default:
        break;
    }
  }

  if (pathname === "/drinks") {
    if (method === "GET") {
      return getAllDrinks(req, res);
    } else if (method === "POST") {
      return createDrink(req, res);
    }
  } else if (pathname.startsWith('/drinks') && pathname.split("/").length === 3) {
    switch (method.toLowerCase()) {
      case "get":
        return getOneDrink(req, res);
      case "put":
        return updateOneDrink(req, res);
      case "patch":
        return patchOnDrink(req, res);
      case "delete":
        return deleteOneDrink(req, res);
      default:
        break;
    }
  }
  

  throw404(res);
}
