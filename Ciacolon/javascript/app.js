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
		data.tel = $("#tel").val();
		data.msg = $("#msg").val();
		var comment = new CommentObject();
		comment.save(data, {
			success:function() {
				console.log("Successo");
				alert("Grazie per la Vostra richiesta! Risponderemo il più presto possibile.");
			},
			error:function(e) {
				console.dir(e);
			}
		});

		

		
	});
	
});