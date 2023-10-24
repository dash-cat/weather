//@ts-check
const { stat, writeFile, readFile, copyFile } = require('fs/promises')
const { createHash, randomBytes } = require('crypto')
const { salt } = require('./secret.json')

const SESSION_DURATION = 7 * 24 * 60 * 60 * 1000

/**
 * @typedef {Object} User
 * @property {string} username
 * @property {string} saltedPassword
 * @property {string[]} favoriteLocations
 */

/**
 * @typedef {Object} Session
 * @property {string} username
 * @property {string} token
 * @property {number} created
 * @property {number} requestCount
 */

/**
 * Возвращает посоленный пароль
 * @param {string} password
 */
function saltPassword(password) {
  const hash = createHash('sha256')
  hash.update(password)
  hash.update(salt)
  return hash.digest().toString('base64')
}

/**
 * @returns {string}
 */
function generateToken() {
  return randomBytes(16).toString('hex')
}

class StorageError extends Error { }

class Storage {
  constructor(filename) {
    /**
     * Имя файла, в котором хранятся данные о пользователях
     * @type {string}
     */
    this.filename = filename

    this._storage = {}
  }

  /**
   * Инициализирует хранилище
   */
  async _initialize() {
    try {
      await stat(this.filename)
    } catch (error) {
      if (error.code === 'ENOENT') {
        await writeFile(this.filename, '{}')
      }
    }

    const fileContents = await readFile(this.filename)
    this._storage = JSON.parse(fileContents.toString())
  }

  /**
   * Сохраняет содержимое хранилища в файл
   */
  async _dumpToFile() {
    copyFile(this.filename, `${this.filename}.bak`)
    await writeFile(this.filename, JSON.stringify(this._storage))
  }

  /**
   * 
   * @param {*} key 
   * @returns {any}
   */
  get(key) {
    return this._storage[key]
  }

  /**
   * 
   * @param {string} key 
   * @param {any} value 
   * @returns {Promise<void>}
   */
  async set(key, value) {
    this._storage[key] = value
    await this._dumpToFile()
  }

  /**
   * 
   * @param {string} key 
   * @returns {boolean}
   */
  has(key) {
    return Boolean(this._storage[key]);
  }
}

class UserStorage extends Storage {
  /**
   * Создаёт нового пользователя
   * @param {string} username 
   * @param {string} password 
   * @return {Promise<User>}
   */
  async createUser(username, password) {
    if (this.has(username)) {
      throw new StorageError(`Пользователь ${username} уже существует`)
    }
    const user = {
      username,
      saltedPassword: saltPassword(password),
      favoriteLocations: [],
    }

    await this.set(username, user)
    return user
  }

  /**
   * 
   * @param {string} username 
   * @returns {User}
   */
  getUserByName(username) {
    const user = this.get(username)
    if (!user) {
      throw new StorageError(`Пользователь ${username} не найден`)
    }
    return user
  }

  /**
   * Возвращает пользователя по валидной паре логин/пароль
   * @param {string} username 
   * @param {string} password 
   * @return {Promise<User>}
   */
  async signIn(username, password) {
    const user = this.getUserByName(username)

    if (user.saltedPassword === saltPassword(password)) {
      return user
    }

    throw new StorageError(`Неверный пароль`)
  }
}

class SessionStorage extends Storage {
  /**
   * 
   * @param {string} filename 
   * @param {UserStorage} userStorage 
   */
  constructor(filename, userStorage) {
    super(filename)
    /** @type {UserStorage} */
    this.userStorage = userStorage
  }

  /**
   * 
   * @param {string} username
   * @returns {Promise<Session>}
   */
  async createSession(username) {
    if (!this.userStorage.has(username)) {
      throw new StorageError(`Не удалось создать сессию: пользователя ${username} не существует`)
    }

    const token = generateToken()
    const session = {
      username,
      token,
      created: Date.now(),
      requestCount: 0,
    }
    await this.set(token, session)
    return session
  }

  /**
   * 
   * @param {string} token 
   * @returns {Promise<User>}
   */
  async getUserByToken(token) {
    /** @type {Session} */
    const session = this.get(token)
    if (!session) {
      throw new StorageError(`Невалидный токен`)
    }

    return this.userStorage.getUserByName(session.username)
  }
}

/**
 * Создаёт и возвращает новое хранилище
 * @param {any} theClass
 * @param {any[]} params 
 * @returns {Promise<any>}
 */
async function makeStorage(theClass, ...params) {
  const object = new theClass(...params)
  await object._initialize()
  return object
}
  

module.exports = {
  UserStorage,
  StorageError,
  SessionStorage,
  makeStorage,
}