//"use strict";

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
document.getElementsByClassName("button").disabled = true;
connection.start().then(function () {
    document.getElementsByClassName("button").disabled = false;
}).catch(function () {
    return console.log("FALHOU");
});

//RECEIVE HUB
connection.on("ReceiveVote", function (user, vote) {

    var voteDescription = document.createElement("li");
    voteDescription.textContent = user + " votou na cor " + colorValue(vote);
    document.getElementById("list-vote").appendChild(voteDescription);

    //ATUALIZO CHART
    colorChart.data.datasets[0].data[vote] = colorChart.data.datasets[0].data[vote] + 1
    colorChart.update();
});

//SEND HUB
document.querySelectorAll(".button").forEach(input => input.addEventListener('click', function (event) {
    let user = document.getElementById("nome-usuario").value;
    connection.invoke("SendVote", user, this.value);
    event.preventDefault();
}));

//connection.on("ReceiveVote", function (user, message) {
//    var msg = message.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
//    var encodedMsg = user + " says " + msg;
//    var li = document.createElement("li");
//    li.textContent = encodedMsg;
//    document.getElementById("messagesList").appendChild(li);
//});

//connection.start().then(function () {
//    document.getElementById("sendButton").disabled = false;
//}).catch(function (err) {
//    return console.error(err.toString());
//});

//document.getElementById("sendButton").addEventListener("click", function (event) {
//    var user = document.getElementById("userInput").value;
//    var message = document.getElementById("messageInput").value;
//    connection.invoke("SendVote", user, message).catch(function (err) {
//        return console.error(err.toString());
//    });
//    event.preventDefault();
//});


