"use strict";

const ApiGateway = require("moleculer-web");

// go tutorrial github
module.exports = {
	name: "api",
	mixins: [ ApiGateway],

	settings: {
		port: process.env.PORT || 9000,

        cors: {
            // Configures the Access-Control-Allow-Origin CORS header.
            origin: "*",
            // Configures the Access-Control-Allow-Methods CORS header.
            methods: ["GET", "PATCH", "OPTIONS", "POST", "PUT", "DELETE"],
            // Configures the Access-Control-Allow-Headers CORS header.
            allowedHeaders: ["Content-Type"],
            // Configures the Access-Control-Expose-Headers CORS header.
            exposedHeaders: [],
            // Configures the Access-Control-Allow-Credentials CORS header.
            credentials: false,
            // Configures the Access-Control-Max-Age CORS header.
            maxAge: 3600
        },

		routes: [

			{
				path: "/status/",
				whitelist: [
					// Access to any actions in all services
					"*"
				],
				aliases: {
					// The `name` comes from named param.
					// You can access it with `ctx.params.name` in action
					// "GET hi/:name": "greeter.welcome",
					// "POST user/:auth0_id": "user.create",
					"GET server": "application.configuration",
					"GET health": "application.health",
					"GET database": "application.database",
					"GET reset": "application.reset",
				}
			},
			{
				bodyParsers: {
	                json: true,
	            },
				path: "/api/v1/",
				whitelist: [
					// Access to any actions in all services
					"*"
				],
				aliases: {
					"POST user": "utilisateur.create",
					"GET user" : "utilisateur.get",
					"PATCH user" : "utilisateur.edit",
					"POST order/user": "commande.create",
					"GET order" : "commande.get",
					"GET order/user" : "commande.get_liste",
					
					"POST product" : "products.create",
					"GET product" : "products.get",
					"PATCH product" : "products.edit",
					"PATCH order/product/increment" : "commande.increment",
					"PATCH order/product/decrement" : "commande.decrement", 
					"PATCH product/increment" : "products.increment",
					"PATCH product/decrement" : "products.decrement",	
					"PATCH order" : "commande.validation"				
					}

			}		//d61b5762-0746-4674-a4b8-b7898991827c
					//order:674428b0-225e-409b-a500-958bb9b2ed13
					//produit:0e57879f-8ffd-4a83-9fd1-607e6bdfa59b
					//toz@hotmail.fr
		]

	}
};
