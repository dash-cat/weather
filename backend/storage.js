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

class UserStorage {
  /**
   * @private
   */
  constructor(filename) {
    /**
     * Имя файла, в котором хранятся данные о пользователях
     * @type {string}
     */
    this.filename = filename
    /**
     * Данные о пользователях
     * @type {Record<string, User>}
     */
    this.users = {}
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
    this.users = JSON.parse(fileContents.toString())
  }

  /**
   * Сохраняет содержимое хранилища в файл
   */
  async _dumpToFile() {
    copyFile(this.filename, `${this.filename}.bak`)
    await writeFile(this.filename, JSON.stringify(this.users))
  }

  /**
   * Создаёт и возвращает новое хранилище
   * @param {string} filename 
   * @returns 
   */
  static async makeStorage(filename) {
    const storage = new UserStorage(filename)
    await storage._initialize()
    return storage
  }

  /**
   * Создаёт нового пользователя
   * @param {string} username 
   * @param {string} password 
   * @return {User}
   */
  async createUser(username, password) {
    if (this.users[username]) {
      throw new StorageError(`Пользователь ${username} уже существует`)
    }
    const user = {
      username,
      saltedPassword: saltPassword(password),
      favoriteLocations: [],
    }
    this.users[username] = user

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
    const user = this.users[username];
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