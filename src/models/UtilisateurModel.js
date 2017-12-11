const uuidv4 = require('uuid/v4');

var fields_reducers = {
	"email": (value) => value.length > 0
};


var UtilisateurModel = function(params) {
	this.id_user = params.id_user || uuidv4();
	this.email = params.email || "";
	this.lastName = params.lastName || "";
	this.firstName = params.firstName || "";
}

UtilisateurModel.prototype.create = function() {

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


module.exports = UtilisateurModel;
