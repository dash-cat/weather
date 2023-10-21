const { stat, writeFile, readFile } = require('fs/promises')

/**
 * Возвращает посоленный пароль
 * @param {string} password
 */
function saltPassword(password) {
  return password
}

/**
 * @typedef {Object} User
 * @property {string} username
 * @property {string} saltedPassword
 * @property {string[]} favoriteLocations
 */

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
    const user = {
      username,
      saltedPassword: saltPassword(password),
      favoriteLocations: [],
    }
    this.users[username] = user

    await this._dumpToFile()

    return user
  }
}

module.exports = UserStorage