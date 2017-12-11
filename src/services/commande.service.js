"use strict";

const Database = require("../adapters/Database");
const Models = require("../models");
const { MoleculerError } = require("moleculer").Errors;

module.exports = {
	name: "commande",

	settings: {
 		state: {

 		}
	},

	actions: {

		//	call "utilisateur.create" --email  --lastName --firstName
		create: {
			params: {
				id_user: "string",
			},
			handler(ctx) {
				var commande = new Models.Commande(ctx.params).create();
				return ctx.call("commande.verify", { id_user: ctx.params.id_user })
				.then((exists) => {
					if (exists){
						console.log("Commande - create - ", commande);
						if (commande) {
							return Database()
								.then((db) => {
									return db.get("commande")
										.push(commande)
										.write()
										.then(() => {
											return commande;
										})
										.catch(() => {
											return new MoleculerError("Utilisateur", 500, "ERR_CRITIAL", { code: 500, message: "Critical error" } )
										});
							});
						} else {
							return new MoleculerError("User", 417, "ERR_CRITIAL", { code: 417, message: "Commande is not valid" } )
						}
				}else{

					return new MoleculerError("User", 409, "ERR_CRITIAL", { code: 409, message: "User doesn't exist" } )

				}
			})
		}			
	},


	get: {
			params: {
				id_order: "string"
			},
			handler(ctx) {
				return ctx.call("commande.verify2", { id_order: ctx.params.id_order })
				.then((exists) => {
					if (exists) {
						return Database()
							.then((db) => {
								var com = db.get("commande").find({ id_order: ctx.params.id_order }).value();;
								return com;
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

	get_liste: {
		params: {
				id_user: "string"
			},
			handler(ctx) {
				return ctx.call("commande.verify", { id_user: ctx.params.id_user })
				.then((exists) => {
					if (exists) {
						return Database()
							.then((db) => {
								var com = db.get("commande").map("id_order").value();
								return com;
								//var liste = [];
								//for(var i=0;i<=db.get("commande").length;i++){
								//liste[i] = db.get("id_order").find({ id_user: ctx.params.id_user }).value();;
							})
								//return ctx.call("commande.get", { id_user: ctx.params.id_user });
							
							.catch(() => {
								return new MoleculerError("User", 500, "ERR_CRITIAL", { code: 500, message: "Critical error" } )
							});
					} else {
						return new MoleculerError("User", 404, "ERR_CRITIAL", { code: 404, message: "User doesn't exists" } )
					}
				})
			}
	},


		

		//	call "commande.verify" --id_order
		verify: {
			params: {
				id_user: "string"
			},
			handler(ctx) {
				return Database()
					.then((db) => {
						var value = db.get("utilisateur")
										.filter({ id_user: ctx.params.id_user })
										.value();
						return value.length > 0 ? true : false;
					})
			}
		},

		verify2: {
			params: {
				id_order: "string"
			},
			handler(ctx) {
				return Database()
					.then((db) => {
						var value = db.get("commande")
										.filter({ id_order: ctx.params.id_order })
										.value();
						return value.length > 0 ? true : false;
					})
			}
		},

	

	increment: {
			params: {
				id_order : "string",
				id_product : "string"
			},
			handler(ctx) {
				return ctx.call("commande.verify2", { id_order: ctx.params.id_order })
						.then((db_commande) => {
							
							var order = new Models.Commande(db_commande).create();
							order.quantity = db_commande.quantity + 1;
							
							return Database()
								.then((db) => {
									return db.get("commande")
										.find({ id_order: ctx.params.id_order })
										.assign(order)
										.write()
										.then(() => {  
											return order;
										})
										.catch(() => {
											return new MoleculerError("Products", 500, "ERR_CRITIAL", { code: 500, message: "Critical Error" } )
										});
								})
						})
			}
		},

	decrement: {
			params: {
				id_order : "string",
				id_product : "string"
			},
			handler(ctx) {
				return ctx.call("commande.verify2", { id_order: ctx.params.id_order })
						.then((db_commande) => {
							
							var order = new Models.Commande(db_commande).create();
							order.id_product = ctx.params.id_product || db_commande.id_product;
							order.quantity = db_commande.quantity - 1;
							
							return Database()
								.then((db) => {
									return db.get("commande")
										.find({ id_order: ctx.params.id_order })
										.assign(order)
										.write()
										.then(() => {  
											return order;
										})
										.catch(() => {
											return new MoleculerError("Products", 500, "ERR_CRITIAL", { code: 500, message: "Critical Error" } )
										});
								})
						})
			}
		},

	validation: {
			params: {
				id_order : "string",

			},
			handler(ctx) {
				return ctx.call("commande.verify2", { id_order: ctx.params.id_order })
						.then((db_commande) => {
							
							var order = new Models.Commande(db_commande).create();
							order.validation = true;
							
							return Database()
								.then((db) => {
									return db.get("commande")
										.find({ id_order: ctx.params.id_order })
										.assign(order)
										.write()
										.then(() => {  
											return order;
										})
										.catch(() => {
											return new MoleculerError("Products", 500, "ERR_CRITIAL", { code: 500, message: "Critical Error" } )
										});
								})
						})
			}
		},
	}


};
