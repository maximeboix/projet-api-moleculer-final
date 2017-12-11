const uuidv4 = require('uuid/v4');

var fields_reducers = {
	"id_user": (value) => value.length > 0
};


var CommandeModel = function(params) {
	this.id_order = params.id_order || uuidv4();
	this.id_user = params.id_user || false;
	this.id_product = params.product || uuidv4();
	this.quantity = params.quantity || 0;
	this.validation = false;
}

CommandeModel.prototype.create = function() {

	var valid = true;

	var keys = Object.keys(fields_reducers);

	for (var i = 0; i < keys.length; i++)
	{
		if ( typeof this[keys[i]] != typeof undefined ) {
			if ( !fields_reducers[keys[i]](this[keys[i]]) )
			{
				valid = false;
			}
		}
		else
		{
			valid = false;
		}
	}

	if (valid) {
		return this;
	} else {
		return undefined;
	}
}


module.exports = CommandeModel;
