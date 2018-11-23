import { Pool } from 'pg';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';

import { 
  devConfig, 
  prodConfig,
  testConfig 
} from '../configs';

dotenv.config();

const env = typeof process.env.NODE_ENV !== 'undefined'
             ? process.env.NODE_ENV.trim() 
             : 'development';

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
    this._env = config.env;
    this._pool = new Pool(
      (env !== 'test' && env !== 'development')
      ? { connectionString: config.dbConfig } 
      : config.dbConfig);
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
   * Get the connection pool
   * 
   * @return {oject} Returns the connection pool object
   * @memberof Database
   */
  getPool() {
    return this._pool;
  }

  /**
   * End pool
   *
   * @memberof Database
   */
  endPool() {
    this.getPool().end();
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

  /**
   * Drop a table
   *
   * @param {string} table the table name
   * @returns {Promise.object} a promise
   * @memberof Database
   */
  dropTable(table) {
    const query = {
      text: `DROP TABLE IF EXISTS ${table}`
    };
    return this.sqlQuery(query).then(() => {
      if (env === 'development') {
        console.log(`Table ${table} successfully dropped`);
      }
      return Promise.resolve(true);
    }).catch((e) => {
      return Promise.reject(e.toString());
    });
  }

  /**
   * Create a table
   *
   * @param {object} meta object containing the meta date to create the table
   * @returns {promises.object} a promise
   * @memberof Database
   */
  createTable(meta) {
    const query = { text: meta.sql };
    return this.sqlQuery(query).then(() => {
      if (env === 'development') {
        console.log(`Table ${meta.table} successfully created`);
      }
      return Promise.resolve(true);
    }).catch((error) => {
      console.log(error.toString())
      return Promise.reject(error.toString());
    });
  }

  /**
   * Drop the database tables
   *@returns {Promise.object} a promise
   * @memberof Database
   */
  dropTables() {
    return this.dropTable('parcels').then(() => {
      return this.dropTable('users').then(() => {
        return Promise.resolve(true);
      }).catch((error) => {
        return Promise.reject(error.toString());
      });
    }).catch(() => {
      Promise.reject();
    });
  }

 /**
  * Create the database tables
  * @returns {Promise.object} a promise
  * @memberof Database 
  */
  createTables() {
    return this.createTable(this.getUserTableMeta()).then(() => {
      return this.seedAdmin().then((r) => {
        return this.createTable(this.getParcelTableMeta()).then(() => {
        }).catch(() => {});
      }).catch(() => {})
    }).catch(() => {});
	}

	/**
	 * Get parcel table meta data
	 *
	 * @returns {object} an object containing users table meta data 
	 * @method getParcelTableMeta
	 * @memberof Database
	 */
	getParcelTableMeta() {
		return {
			table: 'parcels',
			sql: `CREATE TABLE IF NOT EXISTS public.parcels
						(
							parcelid SERIAL,
							weight FLOAT NOT NULL,
							description VARCHAR (255),
							deliverymethod VARCHAR (50) NOT NULL,
							pickupaddress VARCHAR (150) NOT NULL,
							pickupcity VARCHAR (100) NOT NULL,
							pickupstate VARCHAR (100) NOT NULL,
							pickupdate VARCHAR NOT NULL,
							destinationaddress VARCHAR (150) NOT NULL,
							destinationcity VARCHAR (100) NOT NULL,
							destinationstate VARCHAR (100) NOT NULL,
							deliverystatus VARCHAR (50) NOT NULL DEFAULT 'Placed'::character varying,
							presentlocation VARCHAR (100) NOT NULL DEFAULT 'Not available'::character varying,
							trackingno VARCHAR (100) NOT NULL,
							price real NOT NULL,
							senton timestamp with time zone DEFAULT NULL,
							deliveredon timestamp with time zone DEFAULT NULL,
							receivername VARCHAR (50) NOT NULL,
							receiverphone VARCHAR (50) NOT NULL,
							userid integer NOT NULL,
							createdat timestamp with time zone NOT NULL,
							updatedat timestamp with time zone NOT NULL,
							CONSTRAINT parcels_trackingno_key UNIQUE (trackingno),
							CONSTRAINT parcels_userid_fkey FOREIGN KEY (userid)
							REFERENCES public.users (userid) MATCH SIMPLE
							ON UPDATE CASCADE
							ON DELETE SET NULL
						);`
		};
  }

	/**
	 *
	 *
	 * @returns {object} an object containing users table meta data 
	 * @method getUserTableMeta
	 * @memberof Database
	 */
	getUserTableMeta() {
		return {
			table: 'users',
			sql: `CREATE TABLE IF NOT EXISTS public.users
						(
              userid SERIAL,
              firstname VARCHAR (100) NOT NULL,
              lastname VARCHAR (100) NOT NULL,
              email VARCHAR (100) NOT NULL,
              password VARCHAR (100) NOT NULL,
              isadmin BOOLEAN NOT NULL DEFAULT false,
              createdat TIMESTAMP WITH TIME ZONE NOT NULL,
              updatedat TIMESTAMP WITH TIME ZONE NOT NULL,
              CONSTRAINT users_pkey PRIMARY KEY (userid),
              CONSTRAINT users_email_key UNIQUE (email)
            );`
				}; 
  }

  seedAdmin() {
    const moment = new Date();
    const password = bcrypt.hashSync('Password1', bcrypt.genSaltSync(10));
    const query = {
      text: `INSERT INTO users (firstname, lastname, isadmin, email, password, createdat, updatedat)
             VALUES($1, $2, $3, $4, $5, $6, $7)`,
      values: ['Admin', 'Admin', true, 'admin@gmail.com', password, moment, moment]
    }
    return this.sqlQuery(query).then((r) => Promise.resolve(true))
    .catch((e) => Promise.reject(e.toString()))
  }
}

let dbConfig;
if (env === 'test' || env === 'development') {
  dbConfig = env === 'test' ? testConfig : devConfig;
} else {
  dbConfig = prodConfig;
}

export default new Database({ env, dbConfig });
