function mainEvent() {
  let image1 = document.getElementById("image1");
  let image2 = document.getElementById("image2");
  let submit = document.getElementById("countryForm");

  image1.addEventListener("click", function () {
    google.charts.load("current", { packages: ["corechart"] });
    google.charts.setOnLoadCallback(drawPieChart);
  });

  image2.addEventListener("click", function () {
    google.charts.load("current", { packages: ["scatter"] });
    google.charts.setOnLoadCallback(drawScatterChart);
  });

  submit.addEventListener("click", async (e) => {
    e.preventDefault();
    const selectField = document.getElementById("country");
    const value = selectField.value;
    const text = selectField.options[selectField.selectedIndex].text;
    const selectField1 = document.getElementById("country1");
    const value1 = selectField1.value;
    const text1 = selectField1.options[selectField1.selectedIndex].text;
    const results = await fetch("https://open.er-api.com/v6/latest/" + value);
    const arrayFromJson = await results.json();

    console.log(arrayFromJson);
    document.getElementById("exchRate").innerHTML = arrayFromJson.rates[value1];
  });
}

function drawPieChart() {
  var data = google.visualization.arrayToDataTable([
    ["Task", "Hours per Day"],
    ["Work", 11],
    ["Eat", 2],
    ["Commute", 2],
    ["Watch TV", 2],
    ["Sleep", 7],
  ]);

  var options = {
    width: 800,
    height: 500,
    title: "My Daily Activities",
  };

  var chart = new google.visualization.PieChart(
    document.getElementById("piechart")
  );

  chart.draw(data, options);
  let piechart = document.getElementById("piechart");
  piechart.style.display = "flex";

  let scatterchart = document.getElementById("scatterchart");
  scatterchart.style.display = "none";
}

function drawScatterChart() {
  var data = new google.visualization.DataTable();
  data.addColumn("number", "Hours Studied");
  data.addColumn("number", "Final");

  data.addRows([
    [0, 67],
    [1, 88],
    [2, 77],
    [3, 93],
    [4, 85],
    [5, 91],
    [6, 71],
    [7, 78],
    [8, 93],
    [9, 80],
    [10, 82],
    [0, 75],
    [5, 80],
    [3, 90],
    [1, 72],
    [5, 75],
    [6, 68],
    [7, 98],
    [3, 82],
    [9, 94],
    [2, 79],
    [2, 95],
    [2, 86],
    [3, 67],
    [4, 60],
    [2, 80],
    [6, 92],
    [2, 81],
    [8, 79],
    [9, 83],
    [3, 75],
    [1, 80],
    [3, 71],
    [3, 89],
    [4, 92],
    [5, 85],
    [6, 92],
    [7, 78],
    [6, 95],
    [3, 81],
    [0, 64],
    [4, 85],
    [2, 83],
    [3, 96],
    [4, 77],
    [5, 89],
    [4, 89],
    [7, 84],
    [4, 92],
    [9, 98],
  ]);

  var options = {
    width: 800,
    height: 500,
    chart: {
      title: "Students' Final Grades",
      subtitle: "based on hours studied",
    },
    hAxis: { title: "Hours Studied" },
    vAxis: { title: "Grade" },
  };

  var chart = new google.charts.Scatter(
    document.getElementById("scatterchart")
  );

  chart.draw(data, google.charts.Scatter.convertOptions(options));

  let piechart = document.getElementById("piechart");
  piechart.style.display = "none";

  let scatterchart = document.getElementById("scatterchart");
  scatterchart.style.display = "flex";
}

/*
  This last line actually runs first!
  It's calling the 'mainEvent' function at line 57
  It runs first because the listener is set to when your HTML content has loaded
*/
document.addEventListener("DOMContentLoaded", async () => mainEvent()); // the async keyword means we can make API requests
