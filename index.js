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
const { writeJson } = require("./utils");

http
  .createServer(function (req, res) {
    handleUsersRequest(req, res);
  })
  .listen(8080);
console.log("Listening on port 8080");

function throw404(res) {
  writeJson(res, { status: "Resource not found" }, 404);
}

function handleUsersRequest(req, res) {
  const { pathname } = parse(req.url);
  const { method } = req;
  if (pathname === "/users") {
    if (method === "GET") {
      return getAllUsers(req, res);
    } else if (method === "POST") {
      return createUser(req, res);
    }
  } else if (pathname.split("/").length === 3) {
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

  throw404(res);
}
