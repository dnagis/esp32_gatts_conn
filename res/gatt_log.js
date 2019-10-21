'use strict';

//npm install @hapi/hapi
const Hapi = require('@hapi/hapi');
//npm install sqlite https://github.com/kriasoft/node-sqlite
const sqlite = require('sqlite');



const db_file = "/root/dbgattlog.db"

const init = async () => {

    const server = Hapi.server({
        port: 1212,
        host: '0.0.0.0'
    });
    

	async function request_to_db(conn){
					var date = Date.now();
					var epoch_s = Math.floor(date/1000);
					var db = await sqlite.open(db_file);
					console.log(new Date() + " ->" + conn);
					//CREATE TABLE data (epoch INT, conn INT);
					var rows = await db.all("INSERT into data(epoch, conn) values((?),(?));", epoch_s, conn);
					return 0;				
	}

	
	//curl -H "Content-Type: application/json" -X POST -d '{"conn":"1"}' http://0.0.0.0:1212/gattlog
	server.route({
		    method: 'POST',
		    path:'/gattlog', 
		    options:{ cors:true },
			handler: async (request, reply) => {						
						return await request_to_db(request.payload.conn);
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
