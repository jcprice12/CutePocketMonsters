$(document).ready(function(){
    var qValArr = [];      
    $("#submit").on("click", function(){
        // Form validation
        function validateForm() {
            var isValid = true;

            $('.radioGroup').each(function() {
                var id = '#' + $(this).attr('id') + ' input:radio:checked'
                var radioCheckVal = $(id).val()
                if (radioCheckVal === undefined){
                    isValid = false;
                    // break;
                } else {
                    qValArr.push(radioCheckVal)
                }
            });
            return isValid  
        }

        // If all required fields are filled
        if (validateForm() === true){
            $.ajax({
                method: "POST",
                url: "/survey",
                data: {arr: qValArr} 
            }).done(function(data) {
                if (data.hasOwnProperty("redirect")){
                    if(data.redirect === "/survey"){
                        Location.reload(true);
                    } else {
                        window.location = data.redirect;
                    }
                }
            });
        } else {
            qValArr =[];
            alert("Please fill out all fields before submitting!");
        }
    });
});