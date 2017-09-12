$(document).ready(function(){
    //listeners here
    $("#registerUserForm").submit(function(event){
        event.preventDefault();
        var myFormData = {
            username : $("#usernameInput").val().trim(),
            password : $("#passwordInput").val(),
            email : $("#emailInput").val().trim()
        }
        var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if(!re.test(myFormData.email)){
            return;
        }

        $.ajax({
			type: "POST",
			url : "/register",
			data : myFormData,
			dataType : "json",
			success : function(dataBack){
                console.log(dataBack);
                if (typeof dataBack.redirect == 'string'){
                    if(dataBack.redirect === "/register"){
                        Location.reload(true);
                    } else {
                        window.location = dataBack.redirect;
                    }
                }
            }
        });
    });
});

