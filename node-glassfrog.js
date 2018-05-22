/*!
 * node-glassfrog
 * A nodejs library which supports Glassfrog's REST API.
 * Author: Roger Pfaff <info@rogerpfaff.de>
 * Reference: https://app.glassfrog.com/docs/api/v3
 */

 'use strict()';

/**
 * Module dependencies
 */
var request = require('request');
var Url = require('url');

////////////////////////////////////////////////////////////////////////////////////
/**
 * Glassfrog
 *
 * @param {String} endpoint, Glassfrog hostname
 * @param {Object} config
 *  - {String} apiKey, API access key for Glassfrog
 */
function Glassfrog(endpoint, config) {
  if (!endpoint) throw new Error('endpoint not specified!');

  if (typeof endpoint === 'string') {
    host = Url.parse(endpoint);
  } else if (typeof endpoint !== 'object') {
    throw new Error('endpoint should be a string or url object!');
  }

  var baseUrl = Url.format(endpoint);
  this._request = request.defaults({baseUrl: baseUrl});

  if (!config || !(config.apiKey)) {
    throw new Error('You should provide an API key!');
  }
  this.config = config;
}

Glassfrog.prototype = {
  // get & set property
  get apiKey() {
    return this.config.apiKey;
  },
  set apiKey(apiKey) {
    this.config.apiKey = apiKey;
  },
};

/**
 * encodeURL
 */
Glassfrog.prototype.encodeURL = function(path, params) {
  if (path.slice(0, 1) != '/') path = '/' + path;

  var query = querystring.stringify(params);
  if (query) path = path + '?' + query;

  return path;
};


/**
 * request - request url from Glassfrog
 */
Glassfrog.prototype.request = function(method, path, params, callback) {
  var opts = {
    method: method,
    qs: method === 'GET' ? params : undefined,
    body: method === 'PATCH' || method === 'POST' ? params : undefined,
    headers: {
      'Content-Type': 'application/json'
    },
  };

  if (this.apiKey) {
    opts.headers['X-Auth-Token'] = this.config.apiKey;
  } else {
    throw new Error('No API Key provided !');
  }

  var req = this._request(path, opts, function(err, res, body) {
    if (err) return callback(err);

    if (res.statusCode != 200 && res.statusCode != 201) {
      var msg = {
        ErrorCode: res.statusCode,
        Message: res.statusMessage,
        Detail: body
      };
      return callback(JSON.stringify(msg));
    }
    
  });
};

/////////////////////////////////////// REST API for Circles ///////////////////////////////////////

/**
 * Listing Circles
 */
 Glassfrog.prototype.circles = function(params, callback) {
   this.request('GET', '/circles', params, callback);
 };


/**
 * Showing a circle
 */
Glassfrog.prototype.get_circle_by_id = function(id, params, callback) {
  if (typeof id !== 'number') throw new Error('Circle ID must be an integer above 0 !');

  this.request('GET', '/circles/' + id, params, callback);
};

/**
 * Showing a circle including circle members
 */
Glassfrog.prototype.get_circle_including_members = function(id, callback) {
  if (typeof id !== 'number') throw new Error('Circle ID must be an integer above 0 !');
  params = {include: "members"};
  this.request('GET', '/circles/' + id, params, callback);
};

/**
 * Showing a circle's people
 */
Glassfrog.prototype.get_circle_roles = function(id, params, callback) {
  if (typeof id !== 'number') throw new Error('Circle ID must be an integer above 0 !');

  this.request('GET', '/circles/' + id + '/people', params, callback);
};

/**
 * Showing a circle's roles 
 */
Glassfrog.prototype.get_circle_roles = function(id, params, callback) {
  if (typeof id !== 'number') throw new Error('Circle ID must be an integer above 0 !');

  this.request('GET', '/circles/' + id + '/roles', params, callback);
};

/**
 * Showing a circle's projects 
 */
Glassfrog.prototype.get_circle_projects = function(id, params, callback) {
  if (typeof id !== 'number') throw new Error('Circle ID must be an integer above 0 !');

  this.request('GET', '/circles/' + id + '/projects', params, callback);
};

/**
 * Showing a circle's metrics 
 */
Glassfrog.prototype.get_circle_metrics = function(id, params, callback) {
  if (typeof id !== 'number') throw new Error('Circle ID must be an integer above 0 !');

  this.request('GET', '/circles/' + id + '/metrics', params, callback);
};

/**
 * Showing a circle's checklist items 
 */
Glassfrog.prototype.get_circle_checklist = function(id, params, callback) {
  if (typeof id !== 'number') throw new Error('Circle ID must be an integer above 0 !');

  this.request('GET', '/circles/' + id + '/checklist_items', params, callback);
};

/////////////////////////////////////// REST API for Projects ///////////////////////////////////////

/**
 * Create a project
 */
Glassfrog.prototype.create_project = function(params, callback) {
  this.request('POST', '/projects', params, callback);
};

/**
 * Update a project
 */
Glassfrog.prototype.update_project = function(id, params, callback) {
  if (typeof id !== 'number') throw new Error('Project ID must be an integer above 0 !');

  this.request('PATCH', '/projects/' + id, params, callback);
};

/**
 * Archive a project
 */
Glassfrog.prototype.archive_project = function(id, params, callback) {
  if (typeof id !== 'number') throw new Error('Project ID must be an integer above 0 !');

  this.request('PATCH', '/projects/' + id, params, callback);
};

/**
 * Delete a project
 */
Glassfrog.prototype.delete_project = function(id, params, callback) {
  if (typeof id !== 'number') throw new Error('Project ID must be an integer above 0 !');

  this.request('DELETE', '/projects/' + id, params, callback);
};


/////////////////////////////////////// REST API for People ///////////////////////////////////////

/**
 * Showing people of the organization 
 */
Glassfrog.prototype.get_people = function(params, callback) {
  this.request('GET', '/people', params, callback);
};

/**
 * Showing a specific person 
 */
Glassfrog.prototype.get_person = function(id, params, callback) {
  if (typeof id !== 'number') throw new Error('Person ID must be an integer above 0 !');
  
  this.request('GET', '/people/' + id, params, callback);
};

/////////////////////////////////////// REST API for Roles ///////////////////////////////////////

/**
 * Get Roles for the organization
 */
 Glassfrog.prototype.roles = function(params, callback) {
   this.request('GET', '/roles', params, callback);
 };

/**
 * Get Roles for a circle
 */
 Glassfrog.prototype.roles_circle = function(id, params, callback) {
   if (typeof id !== 'number') throw new Error('Person ID must be an integer above 0 !');
   
   this.request('GET', '/circles/' + id + '/roles', params, callback);
 };

/**
 * Get Roles for a person
 */
 Glassfrog.prototype.roles_person = function(id, params, callback) {
   if (typeof id !== 'number') throw new Error('Person ID must be an integer above 0 !');
   
   this.request('GET', '/people/' + id + '/roles', params, callback);
 };

/////////////////////////////////////// REST API for Metrics ///////////////////////////////////////

/////////////////////////////////////// REST API for Checklist Items ///////////////////////////////////////

////////////////////////////////////////////////////////////////////////////////////////
module.exports = Glassfrog;
