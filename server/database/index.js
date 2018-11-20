import { Pool } from 'pg';
import { 
  devConfig, 
  testConfig 
} from '../configs';

/**
 * @class Database
 */
class Database {
  /**
   * Creates an instance of Database.
   * 
   * @param {object} config - the database configuration object
   * @memberof Database
   */
  constructor(config) {
    this._pool = new Pool(config);
  }

  /**
   * Gets an error message if database connection fails
   * 
   * @returns {string} Returns the error message
   * @memberof Database
   */
  dbError() {
    return `Sorry, a database error occured`;
  }

  /**
   * 
   * @return {oject} Returns the connection pool object
   * @memberof Database
   */
  getPool() {
    return this._pool;
  }

  /**
   * Run an sql query
   *
   * @param {Object} query Query configuration object  
   * @returns {Promise.object} A promise that resolve on success; rejects if otherwise
   * @memberof Database
   */
  sqlQuery(query) {
    return this._pool.query(query);
  }
}
export default new Database( 
  process.env.NODE_ENV === 'test' ? testConfig : devConfig
);
