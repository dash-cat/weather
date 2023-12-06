//@ts-check
const express = require("express");
const cookieParser = require("cookie-parser");
const { UserStorage, SessionStorage, DishStorage } = require("./storage");
const { PrismaClient } = require("@prisma/client");
const cors = require("cors");

const PORT = 3000;

/**
 *
 * @param {Error} error
 * @returns
 */
function makeErrorResponse(error) {
  return {
    type: "error",
    message: error.message,
  };
}

/**
 *
 * @param {string} route
 */
function makeRedirectResponse(route) {
  return {
    type: "redirect",
    route,
  };
}

async function withErrorHandler(response, callback) {
  try {
    await callback();
  } catch (error) {
    console.error(error);
    response.statusCode = 400;
    response.send(makeErrorResponse(error));
  }
}

async function init() {
  const prisma = new PrismaClient();
  /** @type {UserStorage} */
  const userStorage = new UserStorage(prisma);
  /** @type {SessionStorage} */
  const sessionStorage = new SessionStorage(prisma, userStorage);

  const dishStorage = new DishStorage(prisma, userStorage);

  /**
   *
   * @param {import('express').Request} request
   * @param {import('express').Response} response
   * @param {import('express').NextFunction} next
   */
  function checkTokenMiddleware(request, response, next) {
    withErrorHandler(response, async () => {
      const user = await sessionStorage.getUserByToken(
        request.cookies["Token"]
      );
      response.locals.user = user;
      next();
    });
  }

  const parseCookiesMiddleware = cookieParser();

  const middlewares = [parseCookiesMiddleware, checkTokenMiddleware];

  const app = express();

  app.use(cors());
  app.use(express.static("../frontend/dist"));
  app.use(express.json());

  app.post("/sign-in", (request, response) => {
    const { body } = request;
    withErrorHandler(response, async () => {
      const user = await userStorage.signIn(
        `${body.login}`,
        `${body.password}`
      );
      const session = await sessionStorage.createSession(user.login);
      response.cookie("Token", session.token);
      response.send(makeRedirectResponse("/newdish"));
    });
  });

  app.post("/sign-up", async (request, response) => {
    const { body } = request;
    withErrorHandler(response, async () => {
      const user = await userStorage.createUser(
        `${body.login}`,
        `${body.password}`
      );
      console.log("user", user);
      const session = await sessionStorage.createSession(user.login);
      response.cookie("Token", session.token);
      response.send(makeRedirectResponse("/newdish"));
    });
  });

  app.post("/newdish", async (request, response) => {
    const { body } = request;
    withErrorHandler(response, async () => {
      console.log("ree", body);
      dishStorage.createDish(body);
    });
  });
  app.get("/menu", async (request, response) => {
    withErrorHandler(response, async () => {
      const menu = await dishStorage.getMenu();
      console.log("menu", menu);
      return response.send(menu);
    });
  });

  app.listen(PORT, () => {
    console.log(`Example app listening on port ${PORT}`);
  });
}

init();
