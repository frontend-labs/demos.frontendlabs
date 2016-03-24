/**
 * Contiene las viariables globales de configuracion
 *
 * @module Config
 * @author Victor Sandoval
 */

var CONFIG = {
	prod : false,
	port : 4000,
	tests : {
		unit: {module: 'sections', sections : 'home'}
	}
};

module.exports = CONFIG;
