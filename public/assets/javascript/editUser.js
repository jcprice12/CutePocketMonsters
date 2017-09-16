$(document).ready(function(){
    //listen for row clicks to choose starters
    //some validation here to make sure you don't choose more than 6 or less than 1
    //further validation on the server
    $(".myTr").click(function(){
        var starterCol = $(this).find('.starterCol');
        if(starterCol){
            var starting = starterCol.attr("data-starting");
            if(starting == "true"){
                var starters = $(".myTr").find("[data-starting='true']");
                if(starters.length > 1){
                    starterCol.html('');
                    starterCol.attr("data-starting",false);
                }
            } else {
                var starters = $(".myTr").find("[data-starting='true']");
                if(starters.length < 6){
                    starterCol.html('<span class="glyphicon glyphicon-ok"></span>');
                    starterCol.attr("data-starting",true);
                }
            }
        }
    });

    //submit the edit user form
    //some validation here for user convenience
    $("#editUserForm").submit(function(event){
        event.preventDefault();
        var myFormData = {};
        myFormData.username = $("#usernameInput").val().trim();
        var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if(!re.test($("#emailInput").val().trim())){
            alert("Invalid email format");
            return;
        }
        myFormData.email = $("#emailInput").val().trim();
        myFormData.oldPassword = $("#oldPasswordInput").val();
        myFormData.newPassword = $("#newPasswordInput").val();
        if(!myFormData.oldPassword){
            alert("You must provide your current password to edit your profile");
            return;
        }
        myFormData.starters=[];
        //var starterElements = document.getElementsByClassName("glyphicon-ok");
        var starterElements = $(".myTr").find("[data-starting='true']");
        for(var i = 0; i < starterElements.length; i++){
            myFormData.starters.push($(starterElements[i]).attr("data-my-number"));
        }
        $.ajax({
            method: "PUT",
            url: "/users/edit",
            data: myFormData,
            success : function(dataBack){
                console.log(dataBack);
                if(dataBack.hasOwnProperty("error")){
                    alert(dataBack.error);
                }
                if (dataBack.hasOwnProperty("redirect")){
                    window.location = dataBack.redirect;
                }
            }
        });

    });
});