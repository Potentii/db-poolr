// *Requiring the needed modules:
const mysql = require('mysql2');
const QueryService = require('./query-service.js');

/**
 * The pool of connections
 */
let pool;



/**
 * Sets up and starts the poolr service
 * @param {object} settings The settings object to configure the service
 * @return {Promise}        The start promise, it resolves into a QueryService instance, or rejects with an error if the pool couldn't be set
 * @author Guilherme Reginaldo Ruella
 */
function start(settings){
   // *Checking if the settings wasn't set, and if it wasn't, rejecting the promise:
   if(!settings) return Promise.reject(new Error('Missing poolr boot settings'));

   // *Starting the connections' pool:
   return startDBPool(settings)
      // *Handling exceptions:
      .catch(err => {
         // *If something went wrong:
         // *Stopping the pooler:
         return stop()
            // *Rejecting the promise chain:
            .then(() => Promise.reject(err));
      });
}



/**
 * Ends the poolr gently
 * @return {Promise}  The ending promise
 * @author Guilherme Reginaldo Ruella
 */
function stop(){
   // *Ending the database connections pool:
   return stopDBPool();
}



/**
 * Configures and starts the connections pool
 * @param {object} settings The settings object to configure the pool
 * @return {Promise}        The start promise, it resolves into a QueryService instance, or rejects with an error if the pool couldn't be set
 * @author Guilherme Reginaldo Ruella
 */
function startDBPool(settings){
   // *Returning the starting promise:
   return new Promise((resolve, reject) => {

      // *Starting the connection pool:
      pool = mysql.createPool(settings);

      // *When connections get queued:
      pool.on('enqueue', () => {
         // *Logging this event:
         console.log('Connections are queueing up!');
      });

      // *Getting a connection from the pool (to test it):
      pool.getConnection((err, conn) => {
         // *Checking if something went wrong, and if something did, rejecting the promise:
         if(err) return reject(err);

         // *Destroying the test connection:
         conn.destroy();

         // *Resolving the promise with the service interface:
         resolve(new QueryService(pool));
      });

   });

}



/**
 * Ends all connections in the pool gracefully
 * @return {Promise}  The ending promise
 * @author Guilherme Reginaldo Ruella
 */
function stopDBPool(){
   // *Returning the end promise:
   return new Promise((resolve, reject) => {
      // *Checking if the connection pool was set, and if it didn't, resolving the promise:
      if(!pool) return resolve();

      // *Ending all connections in the pool:
      pool.end(err => {
         // *Checking if something went wrong, and if it did, rejecting the promise:
         if(err) return reject(err);

         // *Unreferencing the pool variable:
         pool = undefined;

         // *Resolving the promise, as the connections have all been properly ended:
         resolve();
      });

   });

}



// *Exporting this module:
module.exports = { start, stop };
