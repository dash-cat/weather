const { stat, writeFile, readFile } = require('fs/promises')

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
}

module.exports = UserStorage