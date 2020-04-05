﻿function drawLineChart(gameId, idOfPlayers, gameChoice, result) {
    console.log('gameId', gameId, 'idOfPlayers', idOfPlayers, 'gameChoice', gameChoice, 'result', result);
    var labelsForChart = [];
    for (var i = 0; i < gameChoice.length; i++) labelsForChart.push([i + 1, moment(gameChoice[i].createdAt).format("DD/MM/YY")]); // skapar labels under grafen
    var datasetsForLineChart = createDataSetsForLineChart(idOfPlayers, gameChoice, result); //skapar samtliga dataset
    new Chart(document.getElementById("line-chart"), {
        type: 'line',
        data: {
            labels: labelsForChart,
            datasets: datasetsForLineChart
        },
        options: {
            spanGaps: true,
            title: {
                display: true,
                text: "Statistik för: " + games.filter(game => gameId === game._id)[0].name
            },
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true,
                        userCallback: function (label, index, labels) {
                            // when the floored value is the same as the value we have a whole number
                            if (Math.floor(label) === label) {
                                return label;
                            }
                        },
                    }
                }]
            }
        }
    });
}

function createDataSetsForLineChart(idOfPlayers, gameChoice, result) {
    var datasetsForLineChart = [];
    for (var i = 0; i < idOfPlayers.length; i++) {
        result = calculateGames(gameChoice, idOfPlayers[i]);
        var userName = users.filter(user => user._id === idOfPlayers[i]);
        if (result.length > 0) {
            datasetsForLineChart.push({
                "data": result,
                "label": users.filter(user => user._id === idOfPlayers[i])[0].username,
                "borderColor": colors[i],
                "fill": false
            })
        }
    }
    return datasetsForLineChart;
}
