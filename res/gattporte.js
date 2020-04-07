'use strict';

//npm install @hapi/hapi
const Hapi = require('@hapi/hapi');
//npm install sqlite https://github.com/kriasoft/node-sqlite
//const sqlite = require('sqlite');

const sqlite3 = require('sqlite3').verbose();



const db_file = "db/gattporte.db";



const init = async () => {

    const server = Hapi.server({
        port: 8052,
        host: '0.0.0.0'
    });
    
    /**
     * POST
     * curl -d "conn=1" -X POST http://5.135.183.126:8052/gattconn
     * */

	//CREATE TABLE gatt (ID INTEGER PRIMARY KEY AUTOINCREMENT, EPOCH INTEGER NOT NULL, CONN INT NOT NULL);
	//https://www.sqlitetutorial.net/sqlite-nodejs/query/
	async function gattconn_to_db(epoch, conn){				
					console.log("gattconn_to_db 1 " + epoch + " " + conn + " " + db_file);
					
					let db = new sqlite3.Database(db_file, sqlite3.OPEN_READWRITE, (err) => {
							if (err) {
							console.error(err.message);
								}
							console.log('Connected to the chinook database.');
					});
					
					db.serialize(() => {
							db.run(`INSERT INTO gatt(EPOCH, CONN) values (?, ?)`, [epoch, conn], (err) => {
							    if (err) {
							      console.error(err.message);
							    }
							    console.log("insert aurait marche");
							  });
					});
			
					db.close((err) => {
							if (err) {
							console.error(err.message);
								}
							console.log('Close the database connection.');
					});		
					return 0;				
	}
	
	server.route({
		    method: 'POST',
		    path:'/gattconn', 
		    options:{ cors:true },
			handler: async (request, reply) => {
						const ts = Math.round(Date.now() / 1000);  
						console.log("rx: " + request.payload.conn + " a " + ts);
						return await gattconn_to_db(ts, request.payload.conn);
				    },  
	});
	
	
	 /**
     * GET
     * 
     * */
	
	async function fetch_from_db(meas, mac, start){				
					var db = await sqlite.open(db_file);
					console.log(meas, mac, start);
					//select epoch as x, temp as y from data where epoch > ? and mac = ?;
					//pb measure: variables dans une query = placeholders, et pb="placeholders can only be used to substitute values, not column or table names"
					//solution: préparer la query à l'avance:
					var sql_template = `select epoch as x, ${meas} as y from data where epoch > ? and mac = ?;`;
					var rows = await db.all(sql_template, start, mac);
					return rows;				
	}
	
	//curl "http://0.0.0.0:8051/fetch?start=1571667915&mac=30:AE:A4:45:C5:8E" <-- accès via l'objet request.query
	//curl http://0.0.0.0:8051/fetch/30:AE:A4:45:C5:8E/1571667915 <-- accès via l'objet request.params
	server.route({
		    method: 'GET',
		    path:'/fetch/{meas}/{mac}/{start}', 
		    options:{ cors:true },
			handler: async (request, reply) => {
						//console.log(request.params);
						return await fetch_from_db(request.params.meas, request.params.mac, request.params.start);  
				    },  
	});

    await server.start();
    console.log('Server on %s', server.info.uri);
};

process.on('unhandledRejection', (err) => {

    console.log(err);
    process.exit(1);
});

init();
