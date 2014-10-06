/* global $,document,console,Parse */
$(document).ready(function() {
	
	var parseAPPID = "dH2ujoC8Jx75CslZjfF1dh20uGNwFaFojkv7vAzJ";
	var parseJSID = "hbj3kOAWKPg1tpaRQhNQqWzGypoxrOOdyEcAanlE";
	
	Parse.initialize(parseAPPID, parseJSID);
	var CommentObject = Parse.Object.extend("CommentObject");
	
	$("#commentForm").on("submit", function(e) {
		e.preventDefault();

		console.log("Handling the submit");
		//add error handling here
		//gather the form data

		var data = {};
		data.name = $("#name").val();
		data.email = $("#email").val();
		data.msg = $("#msg").val();

		var comment = new CommentObject();
		comment.save(data, {
			success:function() {
				console.log("Success");
				//Alerts are lame - but quick and easy
				alert("Thanks for contacting me! I will get back to you as soon as possible.");
			},
			error:function(e) {
				console.dir(e);
			}
		});
		
	});
	
});