/**
 * Represents a queryable database instance
 * @author Guilherme Reginaldo Ruella
 */
module.exports = class QueryService{

   /**
    * Creates a new QueryService for a given pool
    * @param {object} pool The connections pool object
    */
   constructor(pool){
      // *Setting the pool:
      this._pool = pool;
   }



   /**
    * Queries the database given a SQL command
    * @param  {string} sql    The SQL query
    * @param  {object} values The query values to escape
    * @return {Promise}       The query promise, it resolves into an object containing the 'rows' and 'fields', or rejects with an error if the query fails
    */
   query(sql, values){
      // *Returning the query promise:
      return new Promise((resolve, reject) => {
         // *Getting a connection from the pool:
         this._pool.getConnection((err, conn) => {
            // *Checking if something went wrong, if it did, rejecting the promise:
            if(err) return reject(err);

            // *Querying the database:
            conn.query(sql, values, (err, result, fields) => {
               // *Recycling the connection:
               conn.release();

               // *Checking if something went wrong:
               if(err){
                  // *If it was:
                  // *Checking if it is a custom throwed exception:
                  if(err.code === 'ER_SIGNAL_EXCEPTION'){
                     // *If it is:
                     // *Setting the code to hold the error 'message_text' value:
                     err.code = err.message.replace('ER_SIGNAL_EXCEPTION: ', '');
                  }

                  // *Rejecting the promise:
                  return reject(err);
               }

               // *Resolving the promise:
               resolve({rows: result, fields: fields});
            });

         });

      });

   }

}
