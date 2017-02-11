// *Requiring the needed modules:
const boot_pool = require('./boot-pool.js');



/**
 * Represents a configurable database pool initializer
 * @author Guilherme Reginaldo Ruella
 */
module.exports = class Configurator{

   /**
    * Creates a new configurator
    */
   constructor(){
      // *Initializing the pool options:
      this._port = '3306';
      this._host = 'localhost';
      this._cred = {user: 'root', pass: ''};
      this._connection_limit = 10;
      this._support_big_numbers = false;
      this._timezone = undefined;
      this._schema = undefined;

      // *Declaring the pool promises:
      this._pool_start_promise = null;
      this._pool_stop_promise = null;
   }



   /**
    * Sets the hostname
    * @param  {string} host  The database hostname
    * @return {Configurator} This configurator (for method chaining)
    */
   host(host){
      // *Setting the host:
      this._host = host;
      // *Returning this configurator:
      return this;
   }



   /**
    * Sets the pool port
    * @param  {number|string} port The database port
    * @return {Configurator}       This configurator (for method chaining)
    */
   port(port){
      // *Setting the port:
      this._port = port;
      // *Returning this configurator:
      return this;
   }



   /**
    * Sets the credentials information
    * @param  {string} user  The user
    * @param  {string} pass  The password
    * @return {Configurator} This configurator (for method chaining)
    */
   credentials(user, pass){
      // *Setting the credentials:
      this._cred = { user, pass };
      // *Returning this configurator:
      return this;
   }



   /**
    * Sets the schema to be used
    * @param  {string} schema The name of the schema
    * @return {Configurator}  This configurator (for method chaining)
    */
   schema(schema){
      // *Setting the schema:
      this._schema = schema;
      // *Returning this configurator:
      return this;
   }



   /**
    * Sets the pool connection limit
    * @param  {number} limit The maximum quantity of active connections
    * @return {Configurator} This configurator (for method chaining)
    */
   limit(limit){
      // *Setting the limit:
      this._connection_limit = limit;
      // *Returning this configurator:
      return this;
   }



   /**
    * Sets whether this pool should handle queries with big numbers properly
    * @param  {boolean} enable Whether it should enable or not this functionality (default: true)
    * @return {Configurator}   This configurator (for method chaining)
    */
   bigNumbers(enable = true){
      // *Setting the functionality:
      this._support_big_numbers = enable;
      // *Returning this configurator:
      return this;
   }



   /**
    * Sets timezone
    * @param  {string} timezone The timezone
    * @return {Configurator}    This configurator (for method chaining)
    */
   timezone(timezone){
      // *Setting the timezone:
      this._timezone = timezone;
      // *Returning this configurator:
      return this;
   }



   /**
    * Starts the pool instance
    * @return {Promise} The promise resolves into an QueryService, or it rejects if the pool could not be configured
    */
   start(){
      // *Checking if the pool start promise is set, and if it is, returning it:
      if(this._pool_start_promise) return this._pool_start_promise;

      // *Setting the pool start promise:
      this._pool_start_promise = boot_pool.start({
            host: this._host,
            port: this._port,
            user: this._cred.user,
            password: this._cred.pass,
            database: this._schema,
            connectionLimit: this._connection_limit,
            supportBigNumbers: this._support_big_numbers,
            timezone: this._timezone
         })
         .then(qs => {
            // *Cleaning the stop promise, so it can be stopped again:
            this._pool_stop_promise = null;
            // *Returning the QueryService into the promise chain:
            return qs;
         });

      // *Returning the pool start promise:
      return this._pool_start_promise;
   }



   /**
    * Stops the current pool instance
    * @return {Promise} The promise resolves if the pool could be ended, or rejects if something goes bad
    */
   stop(){
      // *Checking if the pool stop promise is set, and if it is, returning it:
      if(this._pool_stop_promise) return this._pool_stop_promise;

      // *Setting the pool stop promise:
      this._pool_stop_promise = boot_pool.stop()
         .then(info => {
            // *Cleaning the start promise, so it can be started again:
            this._pool_start_promise = null;
            // *Returning the info into the promise chain:
            return info;
         });

      // *Returning the pool stop promise:
      return this._pool_stop_promise;
   }

}
