/* global $,document,console,Parse */
$(document).ready(function() {
	
	var parseAPPID = "9e0AaK3RdoRzAp2RbSGFoaS8Pa10BcVVG8j8sa4U";
	var parseJSID = "TCWYvKoG1DsnA5tNN1mR5iuZcKzHckDb6VaNnBSz";
	
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
				alert("Grazie per la Vostra richiesta! Risponderemo il pi\372 presto possibile.");
			},
			error:function(e) {
				console.dir(e);
			}
		});

	});
	
});