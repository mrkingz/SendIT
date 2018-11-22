import db from './index';

db.dropTables().then(() => {
	db.createTables();
}).catch(() => {});