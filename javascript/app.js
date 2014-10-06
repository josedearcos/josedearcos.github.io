/* global Parse,console,require */

var Mailgun = require('mailgun');
Mailgun.initialize('josedearcos.com', 'key-b18d65be7172d2b16c24624d45c08b7c');

Parse.Cloud.beforeSave("CommentObject", function(request, response) {

	var text = "Comment Email\n" + 
		"From: "+request.object.get("name") + "\n"+
		"Email: "+request.object.get("email") + "\n"+
		"Message:\n" + request.object.get("msg");
	
	Mailgun.sendEmail({
			to: "me@josedearcos.com",
			from: request.object.get("email"),
			subject: "Comment Form from josedearcos.com ",
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