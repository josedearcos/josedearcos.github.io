/* global Parse,console,require */

var Mailgun = require('mailgun');
Mailgun.initialize('raymondcamden.mailgun.org', 'mykeysmilkshakeisbetterthanyours');

Parse.Cloud.beforeSave("CommentObject", function(request, response) {

	var text = "Comment Email\n" + 
		"From: "+request.object.get("name") + "\n"+
		"Email: "+request.object.get("email") + "\n"+
		"Area: "+request.object.get("area") + "\n\n"+
		"Comments:\n" + request.object.get("comments");
	
	Mailgun.sendEmail({
			to: "raymondcamden@gmail.com",
			from: request.object.get("email"),
			subject: "Comment Form - " + request.object.get("area"),
			text: text
		}, {
		success: function(httpResponse) {
			response.success();
		},
		error: function(httpResponse) {
			console.error(httpResponse);
			response.error("Uh oh, something went wrong");
		}
	});

});