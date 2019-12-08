//DEFINIÇÃO INICIAL DO CHART
let ctx = document.getElementById('color-chart').getContext('2d');
let colorChart = new Chart(ctx, {
    type: 'bar',
    data: {
        labels: ['Vermelho', 'Azul', 'Amarelo', 'Verde'],
        datasets: [{
            label: 'Votos',
            data: [0, 0, 0, 0],
            backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)'
            ],
            borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)'
            ],
            borderWidth: 1
        }]
    },
    options: {
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero: true
                }
            }]
        }
    }
});

//CONVERSÃO CÓDIGO PARA STRING COM NOME DA COR
function colorValue(colorCode) {
    let colorName;
    switch (colorCode) {
        case 0:
            colorName = "vermelho";
            break;
        case 1:
            colorName = "azul";
            break;
        case 2:
            colorName = "amarelo";
            break;
        case 3:
            colorName = "verde";
            break;
    }
    return colorName;
}

//CONEXÃO COM O HUB SIGNAL
let connection = new signalR.HubConnectionBuilder().withUrl("/electionhub").build();
document.getElementsByClassName("btn").disabled = true;
connection.start().then(function () {
    document.getElementsByClassName("btn").disabled = false;
    connection.invoke("UpdateChart"); //Recebo o status do chart
});

//----------------------------------------------------------------------------------------------------------------------------------------//

//RECEIVE VOTE 
connection.on("ReceiveVote", function (user, vote) {
    var voteDescription = document.createElement("li");
    voteDescription.textContent = user + " votou na cor " + colorValue(vote);
    document.getElementById("list-interactions").appendChild(voteDescription);

    //ATUALIZO CHART
    colorChart.data.datasets[0].data[vote] = colorChart.data.datasets[0].data[vote] + 1
    colorChart.update();
});

//SEND VOTE 
document.querySelectorAll(".btn").forEach(input => input.addEventListener('click', function (event) {
    let user = document.getElementById("txt-user").value;
    connection.invoke("SendVote", user, this.value);
    event.preventDefault();
}));

//----------------------------------------------------------------------------------------------------------------------------------------//

//RECEIVE COMMENT 
connection.on("ReceiveComment", function (user, comment) {
    var commentDescription = document.createElement("li");
    commentDescription.textContent = user + ": " + comment;
    document.getElementById("list-interactions").appendChild(commentDescription);
});

//SEND COMMENT 
document.getElementById("btn-send").addEventListener('click', function (event) {
    let user = document.getElementById("txt-user").value;
    let comment = document.getElementById("txt-comment").value
    connection.invoke("SendComment", user, comment);
    event.preventDefault();
});

//----------------------------------------------------------------------------------------------------------------------------------------//

//RECEIVE UPDATECHART 
connection.on("UpdateChart", function (vermelho, azul, amarelo, verde) {
    colorChart.data.datasets[0].data = [vermelho, azul, amarelo, verde]; 
    colorChart.update();
});

