$(document).ready(function(){
    $(".myTr").click(function(){
        var starterCol = $(this).find('.starterCol');
        if(starterCol){
            var starting = starterCol.attr("data-starting");
            if(starting == "true"){
                var starters = document.getElementsByClassName("glyphicon-ok");
                if(starters.length > 1){
                    starterCol.html('');
                    starterCol.attr("data-starting",false);
                }
            } else {
                var starters = document.getElementsByClassName("glyphicon-ok");
                if(starters.length < 6){
                    starterCol.html('<span class="glyphicon glyphicon-ok"></span>');
                    starterCol.attr("data-starting",true);
                }
            }
        }
    });
});