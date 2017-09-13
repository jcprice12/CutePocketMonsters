$(document).ready(function(){
    var qValArr = [];      
    $("#submit").on("click", function(){
    // Form validation
    function validateForm() {
            var isValid = true;
            $('.form-control').each(function() {
            if ( $(this).text() === '' )
                isValid = false;
            });

            $('.radioGroup').each(function() {
                var id = '#' + $(this).attr('id') + ' input:radio:checked'
                var radioCheckVal = $(id).val()
                if (radioCheckVal === undefined){
                    isValid = false
                } else {
                    qValArr.push(radioCheckVal)
                }
            })
            

            return isValid  
        }

        // If all required fields are filled
        if (validateForm() === true)
            {
                var searchQuery = compileQuery();
                console.log(searchQuery);

            }
            else {
                qValArr =[];
                alert("Please fill out all fields before submitting!");
        }
    });
});