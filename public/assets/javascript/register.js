$(document).ready(function(){
    //listeners here
    $("#submitRegisterButton").click(function(){
        var myFormData = {
            username : $("#usernameInput").val().trim(),
            password : $("#passwordInput").val(),
            email : $("#emailInput").val().trim()
        }
        var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if(!re.test(myFormData.email)){
            alert("Invalid email address");
            return;
        }
        if(myFormData.username.length < 4){
            alert("Username must be greater than or equal to 4 characters");
            return;
        }
        if(myFormData.password < 4){
            alert("Password must be greater than or equal to 4 characters");
            return;
        }
        console.log(myFormData);
        $.ajax({
			type: "POST",
			url : "/register",
			data : myFormData,
			success : function(dataBack){
                console.log(dataBack);
                if(dataBack.hasOwnProperty("error")) {
                    alert(dataBack.error);
                }
                if (dataBack.hasOwnProperty("redirect")) {
                    if(dataBack.redirect === "/register") {
                        Location.reload(true);
                    } else {
                        window.location = dataBack.redirect;
                    }
                }
            }
        });
    });
});

