console.log("yah");
$(document).ready(function(){
    console.log("ready");
    $(".myTr").click(function(){
        console.log("hello");
        var userId = $(this).attr("data-userId");
        console.log(userId);
    });
});