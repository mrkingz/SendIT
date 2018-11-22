import { Pool } from 'pg';
import dotenv from 'dotenv';
import { 
  devConfig, 
  testConfig 
} from '../configs';
import { promises } from 'fs';

dotenv.config();

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
    this._env = typeof config.env !== 'undefined' ? config.env.trim() : 'development';
    this._pool = new Pool(config.dbConfig);
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
      if (this._env === 'test') {
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
      if (this._env === 'test') {
        console.log(`Table ${meta.table} successfully created`);
      }
      return Promise.resolve(true);
    }).catch((e) => {
      return Promise.reject(e.toString());
    });
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
			sql: `CREATE TABLE public.parcels
						(
							parcelid SERIAL,
							weight FLOAT NOT NULL,
							description VARCHAR (255),
							deliverymethod VARCHAR (50) NOT NULL,
							pickupaddress VARCHAR (150) NOT NULL,
							pickupcity VARCHAR (100) NOT NULL,
							pickupstate VARCHAR (100) NOT NULL,
							pickupdate DATE NOT NULL,
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
						)
						WITH (
								OIDS = FALSE
						)
						TABLESPACE pg_default;
						
						ALTER TABLE public.parcels
								OWNER to postgres;`
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
			sql: `CREATE TABLE public.users
						(
								userid SERIAL,
								firstname VARCHAR (100) NOT NULL,
								lastname VARCHAR (100) NOT NULL,
								email VARCHAR (100) NOT NULL,
								password VARCHAR (100) NOT NULL,
								isadmin boolean NOT NULL DEFAULT false,
								createdat timestamp with time zone NOT NULL,
								updatedat timestamp with time zone NOT NULL,
								CONSTRAINT users_pkey PRIMARY KEY (userid),
								CONSTRAINT users_email_key UNIQUE (email)
						)
						WITH (
								OIDS = FALSE
						)
						TABLESPACE pg_default;
						
						ALTER TABLE public.users
								OWNER to postgres;`
				};
  }
  
  /**
   * Drop the database tables
   *@returns {Promise.object} a promise
   * @memberof Database
   */
  dropTables() {
    //if (this._env === 'test') {
      return this.dropTable('parcels')
      .then(() => {
        return this.dropTable('users').then(() => {
          return Promise.resolve();
        }).catch(() => {
          return Promise.reject();
        });
      }).catch(() => {
        Promise.reject();
      });
    //}
  }

 /**
  * Create the database tables
  * @returns {Promise.object} a promise
  * @memberof Database
  */
 createTables() {
    return this.dropTables().then(() => {
      return this.createTable(this.getUserTableMeta()).then(() => {
        return this.createTable(this.getParcelTableMeta()).then(() => {
        }).catch(() => {});
      }).catch(() => {});
    }).catch(() => {});
	}
}

export default new Database({
  env: process.env.NODE_ENV,
  dbConfig: process.env.NODE_ENV === 'test' ? testConfig : devConfig
});
