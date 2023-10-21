const { stat, writeFile, readFile, copyFile } = require('fs/promises')
const { Hash } = require('crypto')
const { salt } = require('./secret.json')

/**
 * @typedef {Object} User
 * @property {string} username
 * @property {string} saltedPassword
 * @property {string[]} favoriteLocations
 */

/**
 * Возвращает посоленный пароль
 * @param {string} password
 */
function saltPassword(password) {
  /** @type {Hash} */
  const hash = new Hash('sha256')
  hash.update(password)
  hash.update(salt)
  return hash.digest().toString('base64')
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
   * Создаёт и возвращает новое хранилище
   * @param {string} filename 
   * @returns 
   */
  static async makeStorage(filename) {
    const object = new UserStorage(filename)
    await object._initialize()
    return object
  }
  
  /**
   * Инициализирует хранилище
   * @private
   */
  async _initialize() {
    try {
      await stat(this.filename)
    } catch (error) {
      if (error.code === 'ENOENT') {
        writeFile(this.filename, '{}')
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
   * @returns {void}
   */
  set(key, value) {
    this._storage[key] = value
  }

  /**
   * 
   * @param {string} key 
   * @returns {boolean}
   */
  has(key) {
    return Object.hasOwn(this._storage, key);
  }
}

class UserStorage extends Storage {
  /**
   * Создаёт нового пользователя
   * @param {string} username 
   * @param {string} password 
   * @return {User}
   */
  async createUser(username, password) {
    if (this._storage[username]) {
      throw new StorageError(`Пользователь ${username} уже существует`)
    }
    const user = {
      username,
      saltedPassword: saltPassword(password),
      favoriteLocations: [],
    }
    this._storage[username] = user

    await this._dumpToFile()

    return user
  }
  
  /**
   * Возвращает пользователя по валидной паре логин/пароль
   * @param {string} username 
   * @param {string} password 
   * @return {User}
   */
  async signIn(username, password) {
    const user = this._storage[username];
    if (!user) {
      throw new StorageError(`Пользователь ${username} не найден`)
    }

    if (user.saltedPassword === saltPassword(password)) {
      return user
    }

    throw new StorageError(`Неверный пароль`)
  }
}

module.exports = {
  UserStorage,
  StorageError,
}