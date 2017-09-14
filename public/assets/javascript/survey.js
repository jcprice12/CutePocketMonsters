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
            })
            

            return isValid  
        }

        // If all required fields are filled
        if (validateForm() === true)
            {
                $.ajax({
                    method: "POST",
                    url: "/survey",
                    data: {arr: qValArr} 
                }).done(function(data) {
                    // console.log("Data passed in: " + data)
                    window.location.href = "/"
                })
            }
            else {
                qValArr =[];
                alert("Please fill out all fields before submitting!");
        }
    });
});