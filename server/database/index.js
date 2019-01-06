import { Pool } from 'pg';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import Places from '../database/Places';

import { 
  devConfig, 
  prodConfig,
  testConfig 
} from '../configs';

dotenv.config();

const env = typeof process.env.NODE_ENV !== `undefined`
             ? process.env.NODE_ENV.trim() 
             : `development`;

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
    this._tables = [`parcels`, `users`, `states`];
    this._pool = new Pool(
      (env !== `test` && env !== `development`)
      ? { connectionString: config.dbConfig } 
      : config.dbConfig);
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
    return this.sqlQuery(`DROP TABLE IF EXISTS ${table}`).then(() => {
      if (env === `development`) {
        console.log(`Table ${table} successfully dropped`);
      }
      return Promise.resolve(true);
    }).catch((error) => {
      return Promise.reject(error.toString());
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
    return this.sqlQuery(meta.sql).then(() => {
      if (env === `development`) {
        console.log(`Table ${meta.table} successfully created`);
      }
      return Promise.resolve(true);
    }).catch((error) => {
      return Promise.reject(error.toString());
    });
  }

  /**
   * Drop the database tables
   * @returns {Promise.object} a promise
   * @memberof Database
   */
  dropTables() {
    return this.dropTable(`parcels`).then(() => {
      return this.dropTable(`users`).then(() => {
        return this.dropTable(`lgas`).then(() => {
          return this.dropTable(`states`).then(() => Promise.resolve(true));
        });
        //We need to provide a default admin
      });
    }).catch(() => {});
  }

 /**
  * Create the database tables
  * 
  * @returns {Promise.object} a promise
  * @memberof Database 
  */
  createTables() {
    return this.createTable(this.getUsersTableMeta()).then(() => {
      return this.createTable(this.getParcelsTableMeta()).then(() => {
        return this.createTable(this.getStatesTableMeta()).then(() => {
          return this.createTable(this.getLGAsTableMeta())
            .then(() => Promise.resolve(true));
        });
      });
    }).catch((error) => { console.log(error); });
  }
  
  /**
   * Seed database with initial data
   *
   * @returns {Promise} a promise
   * @method seedInitialData
   * @memberof Database
   */
  seedInitialData() {
    return this.seedAdmin().then(() => {
    return this.seedStates().then(() => {
      return this.seedLGAs();
    });
    }).catch(e => console.log(e));
  }

	/**
	 * Get parcel table meta data
	 *
	 * @returns {object} an object containing users table meta data 
	 * @method getParcelTableMeta
	 * @memberof Database
	 */
	getParcelsTableMeta() {
		return {
			table: `parcels`,
			sql: `CREATE TABLE IF NOT EXISTS public.parcels
						(
							"parcelId" SERIAL,
							"weight" FLOAT NOT NULL,
							"description" VARCHAR (255) DEFAULT NULL,
							"deliveryMethod" VARCHAR (50) NOT NULL,
							"pickUpAddress" VARCHAR (150) NOT NULL,
							"pickUpLGAId" integer NOT NULL,
							"pickUpStateId" integer NOT NULL,
							"destinationAddress" VARCHAR (150) NOT NULL,
							"destinationLGAId" integer NOT NULL,
							"destinationStateId" integer NOT NULL,
							"deliveryStatus" VARCHAR (50) NOT NULL DEFAULT 'Placed'::character varying,
              "locationLGAId" integer DEFAULT NULL,
              "locationStateId" integer DEFAULT NULL,
							"trackingNo" VARCHAR (100) NOT NULL,
							"price" real NOT NULL,
							"sentOn" timestamp with time zone DEFAULT NULL,
							"deliveredOn" timestamp with time zone DEFAULT NULL,
							"receiverName" VARCHAR (50) NOT NULL,
							"receiverPhone" VARCHAR (50) NOT NULL,
							"userId" integer NOT NULL,
							"createdAt" timestamp with time zone NOT NULL,
              "updatedAt" timestamp with time zone NOT NULL,
              CONSTRAINT parcels_pkey PRIMARY KEY ("parcelId"),
							CONSTRAINT parcels_trackingNo_key UNIQUE ("trackingNo"),
							CONSTRAINT parcels_userId_fkey FOREIGN KEY ("userId")
							REFERENCES public.users ("userId") MATCH SIMPLE
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
	getStatesTableMeta() {
		return {
			table: `states`,
			sql: `CREATE TABLE IF NOT EXISTS public.states
						(
              "stateId" SERIAL,
              "state" VARCHAR (100) NOT NULL,
              CONSTRAINT state_pkey PRIMARY KEY ("stateId")
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
	getLGAsTableMeta() {
		return {
			table: `lgas`,
			sql: `CREATE TABLE IF NOT EXISTS public.lgas
						(
              "lgaId" SERIAL,
              "stateId" integer NOT NULL,
              "lga" VARCHAR (100) NOT NULL,
							CONSTRAINT states_stateId_fkey FOREIGN KEY ("stateId")
							REFERENCES public.states ("stateId") MATCH SIMPLE
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
	getUsersTableMeta() {
		return {
			table: `users`,
			sql: `CREATE TABLE IF NOT EXISTS public.users
						(
              "userId" SERIAL,
              "firstname" VARCHAR (100) NOT NULL,
              "lastname" VARCHAR (100) NOT NULL,
              "email" VARCHAR (100) NOT NULL,
              "phoneNumber" VARCHAR (50) DEFAULT NULL,
              "password" VARCHAR (100) NOT NULL,
              "isAdmin" BOOLEAN NOT NULL DEFAULT false,
              "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL,
              "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL,
              CONSTRAINT users_pkey PRIMARY KEY ("userId"),
              CONSTRAINT users_email_key UNIQUE ("email")
            );`
				}; 
  }

  /**
   * Seed admin table with default values
   *
   * @returns {Promise} a promise that resolves or reject
   * @memberof Database
   */
  seedAdmin() {
    const moment = new Date();
    const password = bcrypt.hashSync(`Password1`, bcrypt.genSaltSync(10));
    const email = process.env.EMAIL;
    const query = {
      text: `INSERT INTO users (firstname, lastname, "isAdmin", email, password, "createdAt", "updatedAt")
             VALUES($1, $2, $3, $4, $5, $6, $7)`,
      values: [`Gabriel`, `Owvigho`, true, email, password, moment, moment]
    };
    return this.sqlQuery(query).then(() => { 
      console.log(`Admin successfully seeded`);
      return Promise.resolve(true);
    })
    .catch(error => Promise.reject(error.toString()));
  }

  /**
   * Seed states
   *
   * @returns {Promise} a promise that resoles on success
   * @method seedStates
   * @memberof Database
   */
  seedStates() {
    const states = Places.getStates();
    const stmt = `INSERT INTO states("state") VALUES `; 
    const rows = states.map(state => `('${state.replace(/[-]+/g, ' ')}')`);
    return this.sqlQuery(stmt.concat(rows.join(','))).then(() => {
      console.log('States successfuly seeded');
      return Promise.resolve(true);
    }).catch(e => console.log(e));
  }

/**
 * Seed local government areas
 *
 * @returns {Promise} a promise
 * @memberof Database
 */
seedLGAs() { 
    const stmt = `INSERT INTO lgas("stateId", "lga") VALUES `;
    const rows = Places.getStates().map((state, i) => {
      return Places.getLGAs(state).map(lga => `(${i + 1}, '${lga}')`);
    });
    return this.sqlQuery(stmt.concat(rows.join(','))).then(() => {
      console.log(`Local Government Areas successfully seeded`);
    }).catch(e => console.log(e));
  }
}

let dbConfig;
if (env === `test` || env === `development`) {
  dbConfig = env === `test` ? testConfig : devConfig;
} else {
  dbConfig = prodConfig;
}

export default new Database({ env, dbConfig });
