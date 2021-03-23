class ScoreSkill {
    constructor(span, pro, duration, ratio){
        this.span = +span;
        this.pro = +pro;
        this.duration = +duration;
        this.ratio = +ratio;
        this.dp_table = {0: [1]};
    }

    get expectation() {
        return this.calcExpectation();
    }

    calcTimesPro(song) {
        if(!this.dp_table[song]){
            if(song < this.span){
                this.dp_table[song] = [1];
            }else{
                var true_pro = this.calcTimesPro(song-this.span-this.duration).slice().map(p => this.pro*p);
                true_pro.unshift(0);
                var false_pro = this.calcTimesPro(song-this.span).slice().map(p => (1-this.pro)*p);
                console.log(true_pro);
                console.log(false_pro);
                for(var i = 0; i<false_pro.length; i++){
                    true_pro[i] += false_pro[i];
                }
                while(true_pro.length > 1 && true_pro[true_pro.length-1] == 0){
                    true_pro.pop();
                }
                this.dp_table[song] = true_pro;
            }
        }
        return this.dp_table[song];
    }

    calcExpectation() {
        return (this.pro*this.duration*(this.ratio+1)+this.span)/(this.pro*this.duration+this.span);
    }
}

function simulate(){
    var party = 1;
    var timesData = {
        type: "bar",
        data: {
            labels: [],
            datasets: []
        },
        options: {
            title: {
                display: true,
                text: "発動回数の確率"
            },
            scales: {
                xAxes: [{
                    scaleLabel: {
                        display: true,
                        labelString: "発動回数"
                    },
                    maxBarThickness: 35
                }],
                yAxes: [{
                    ticks: {
                        suggestedMin: 0,
                    }
                }]
            },
            legend: {
                display: false
            },
        }
    };  
    $(".cardContainer").each(function() {

        if(!$(this).find("input[type='checkbox'][id*='setting']:checked").val()){
            $(this).find("#expectation").html("---");
            return;
        }

        var span = +($(this).find("#span").val());
        var pro = +($(this).find("#pro").val())/100;
        var duration = +($(this).find("#duration").val());
        var ratio = +($(this).find("#ratio").val())/100;
        var skill = new ScoreSkill(span, pro, duration, ratio);
        $(this).find("#expectation").html("x" + skill.expectation.toFixed(4));

        party *= skill.expectation;

        var dataset = {
            label: $(this).find(".skillHeading").val(),
            data: skill.calcTimesPro(+($("#songTimeInput").val())),
            backgroundColor: $(this).css("background-color")
        }

        timesData["data"]["datasets"].push(dataset);
        console.log(skill.calcTimesPro(+($("#songTimeInput").val())));
    });
    $("#partyExpectation").html("x" + party.toFixed(4));
    var times = [0];
    timesData["data"]["datasets"].forEach(dataset => {
        times.push(dataset["data"].length);
    });
    console.log(Math.max(...times));
    timesData["data"]["labels"] = [...Array(Math.max(...times))].map((_, i) => i);
    if(window.chart){
        window.chart.destroy();
    }
    window.chart = new Chart($("#timesBarChart"), timesData);
}

$(function(){
    simulate();

    $("#simulate").click(function() {
        simulate();
    });
});
