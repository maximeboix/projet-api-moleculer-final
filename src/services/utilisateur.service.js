"use strict";

const Database = require("../adapters/Database");
const Models = require("../models");
const { MoleculerError } = require("moleculer").Errors;

module.exports = {
	name: "utilisateur",

	settings: {
 		state: {

 		}
	},

	actions: {

		//	call "utilisateur.create" --email  --lastName --firstName
		create: {
			params: {
				email: "string",
				firstName: "string",
				lastName: "string"
			},
			handler(ctx) {
				var user = new Models.Utilisateur(ctx.params).create();
				return ctx.call("utilisateur.verify", { email: ctx.params.email })
				.then((exists) => {
					if (exists == false){
						console.log("User - create - ", user);
						if (user) {
							return Database()
								.then((db) => {
									return db.get("utilisateur")
										.push(user)
										.write()
										.then(() => {
											return user;
										})
										.catch(() => {
											return new MoleculerError("Utilisateur", 500, "ERR_CRITIAL", { code: 500, message: "Critical error" } )
										});
							});
						} else {
							return new MoleculerError("User", 417, "ERR_CRITIAL", { code: 417, message: "User is not valid" } )
						}
				}else{

					return new MoleculerError("User", 409, "ERR_CRITIAL", { code: 409, message: "User already exists" } )

				}
			})
		}			
	},


		//	call "utilisateur.get" --email
		get: {
			params: {
				email: "string"
			},
			handler(ctx) {
				return ctx.call("utilisateur.verify", { email: ctx.params.email })
				.then((exists) => {
					if (exists) {
						return Database()
							.then((db) => {
								var user = db.get("utilisateur").find({ email: ctx.params.email }).value();;
								return user;
							})
							.catch(() => {
								return new MoleculerError("User", 500, "ERR_CRITIAL", { code: 500, message: "Critical error" } )
							});
					} else {
						return new MoleculerError("User", 404, "ERR_CRITIAL", { code: 404, message: "User doesn't exists" } )
					}
				})
			}
		},

		//	call "utilisateur.verify" --email
		verify: {
			params: {
				email: "string"
			},
			handler(ctx) {
				return Database()
					.then((db) => {
						var value = db.get("utilisateur")
										.filter({ email: ctx.params.email })
										.value();
						return value.length > 0 ? true : false;
					})
			}
		},

		//	call "utilisateur.edit" --email  --lastName --firstName
		edit: {
			params: {
				email: "string",
				lastName: "string",
				firstName: "string"
			},
			handler(ctx) {
				return ctx.call("utilisateur.get", { email: ctx.params.email })
						.then((exists) => {
							if(exists){
								return ctx.call("utilisateur.get", { email: ctx.params.email })
								.then((db_utilisateur)=>{
							
									var utilisateur = new Models.Utilisateur(db_utilisateur).create();
									console.log(db_utilisateur, utilisateur);
									utilisateur.lastName = ctx.params.lastName || db_utilisateur.lastName;
									utilisateur.firstName = ctx.params.firstName || db_utilisateur.firstName;
									
									return Database()
										.then((db) => {
											return db.get("utilisateur")
												.find({ email: ctx.params.email })
												.assign(utilisateur)
												.write()
												.then(() => {
													return utilisateur.email;
												})
												.catch(() => {
													return new MoleculerError("User", 500, "ERR_CRITIAL", { code: 500, message: "Critical Error" } )
												});
										})
								})
						}else {
							return new MoleculerError("User", 404, "ERR_CRITIAL", { code: 404, message: "User doesn't exists" } )
						}
					})
			}
		}
	}
};
