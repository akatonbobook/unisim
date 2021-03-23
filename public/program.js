function expectation(span, pro, duration, ratio){
    return (pro*duration*(ratio+1)+span)/(pro*duration+span);
}

function simulate(){
    var party = 1;
    $(".cardContainer").each(function() {
        if(!$(this).find("input[type='checkbox'][id*='setting']:checked").val()){
            $(this).find("#expectation").html("---");
            return;
        }
        var span = +($(this).find("#span").val());
        var pro = +($(this).find("#pro").val())/100;
        var duration = +($(this).find("#duration").val());
        var ratio = +($(this).find("#ratio").val())/100;
        var exp = expectation(span, pro, duration, ratio);
        $(this).find("#expectation").html("x" + exp.toFixed(4));
        party *= exp;
    });

    $("#partyExpectation").html("x" + party.toFixed(4));
}

$(function(){
    simulate();

    $("#simulate").click(function() {
        simulate();
    });
});
