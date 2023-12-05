//@ts-check
const { stat, writeFile, readFile, copyFile } = require("fs/promises");
const { createHash, randomBytes } = require("crypto");
const { salt } = require("./secret.json");
const { PrismaClient } = require("@prisma/client");

const SESSION_DURATION = 7 * 24 * 60 * 60 * 1000;

/**
 * @typedef {Object} User
 * @property {number} id
 * @property {string} login
 * @property {string} saltedPassword
 */

/**
 * @typedef {Object} Session
 * @property {string} username
 * @property {string} token
 * @property {Date} created
 */

/**
 * Возвращает посоленный пароль
 * @param {string} password
 */
function saltPassword(password) {
  const hash = createHash("sha256");
  hash.update(password);
  hash.update(salt);
  return hash.digest().toString("base64");
}

/**
 * @returns {string}
 */
function generateToken() {
  return randomBytes(16).toString("hex");
}

class StorageError extends Error {}

class Storage {
  /**
   *
   * @param {PrismaClient} client
   */
  constructor(client) {
    /** @type {PrismaClient} */
    this.client = client;
  }
}

class UserStorage extends Storage {
  /**
   * Создаёт нового пользователя
   * @param {string} login
   * @param {string} password
   * @return {Promise<User>}
   */
  async createUser(login, password) {
    if (
      await this.client.user.findFirst({
        where: { login },
      })
    ) {
      throw new StorageError(`Пользователь ${login} уже существует`);
    }

    const user = await this.client.user.create({
      data: {
        login,
        saltedPassword: saltPassword(password),
      },
    });

    return user;
  }

  /**
   *
   * @param {string} login
   * @returns {Promise<User>}
   */
  async getUserByName(login) {
    const user = await this.client.user.findFirst({
      where: { login },
    });
    if (!user) {
      throw new StorageError(`Пользователь ${login} не найден`);
    }
    return user;
  }

  /**
   * Возвращает пользователя по валидной паре логин/пароль
   * @param {string} username
   * @param {string} password
   * @return {Promise<User>}
   */
  async signIn(username, password) {
    const user = await this.getUserByName(username);

    if (user.saltedPassword === saltPassword(password)) {
      return user;
    }

    throw new StorageError(`Неверный пароль`);
  }
}

class SessionStorage extends Storage {
  /**
   *
   * @param {PrismaClient} client
   * @param {UserStorage} userStorage
   */
  constructor(client, userStorage) {
    super(client);
    /** @type {UserStorage} */
    this.userStorage = userStorage;
  }

  /**
   *
   * @param {string} username
   * @returns {Promise<Session>}
   */
  async createSession(username) {
    const sessionUser = await this.client.session.findFirst({
      where: { username },
    });
    if (!sessionUser) {
      throw new StorageError(
        `Не удалось создать сессию: пользователя ${username} не существует`
      );
    }

    const token = generateToken();
    const session = await this.client.session.create({
      data: {
        username,
        token,
        created: new Date(),
      },
    });
    return session;
  }

  /**
   *
   * @param {string} token
   * @returns {Promise<User>}
   */
  async getUserByToken(token) {

    const session = await this.client.session.findFirst({
      where: { token },
    });

    if (!session) {
      throw new StorageError(`Невалидный токен`);
    }

    return this.userStorage.getUserByName(session.username);
  }
}

module.exports = {
  UserStorage,
  StorageError,
  SessionStorage,
};
