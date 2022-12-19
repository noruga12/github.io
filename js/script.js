async function mainEvent(e) {
  e.preventDefault();
  const field = document.getElementById("country");
  const field2 = document.getElementById("country1");
  let submit = document.getElementById("countryFormSubmit");

  const res = await fetch("https://open.er-api.com/v6/latest");
  const json = await res.json();
  Object.keys(json.rates).forEach((value) => {
    field.innerHTML += `<option value=${value}>${value}</option>`;
    field2.innerHTML += `<option value=${value}>${value}</option>`;
  });
  Chart.defaults.color = "yellow";
  const chart = new Chart(document.getElementById("bar-chart"), {
    type: "bar",
    data: {
      labels: Object.keys(json.rates).slice(0, 5),
      datasets: [
        {
          backgroundColor: [
            "#3e95cd",
            "#8e5ea2",
            "#3cba9f",
            "#e8c3b9",
            "#c45850",
          ],
          data: Object.values(json.rates).slice(0, 5),
        },
      ],
    },
    options: {
      scales: {
        y: {
          ticks: { color: "yellow" },
        },
        x: {
          ticks: { color: "yellow" },
        },
      },
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: `Top 5 exchange rates`,
      },
    },
  });

  submit.addEventListener("click", async (e) => {
    e.preventDefault();

    const selectField = document.getElementById("country");
    const fromValue = selectField.value;
    const text = selectField.options[selectField.selectedIndex].text;
    const selectField1 = document.getElementById("country1");
    const value1 = selectField1.value;
    const text1 = selectField1.options[selectField1.selectedIndex].text;

    try {
      const results = await fetch(
        "https://open.er-api.com/v6/latest/" + fromValue
      );
      const arrayFromJson = await results.json();
      const allRates = arrayFromJson.rates;
      const allRatesValues = Object.values(allRates).sort();
      const i = allRatesValues.findIndex((x) => x === allRates[value1]);
      const allRatesValuesSlice = allRatesValues.slice(
        i < Object.values(allRates).length ? Math.max(i, 0) : 0,
        i < Object.values(allRates).length
          ? Math.min(i + 5, Object.values(allRates).length)
          : 5
      );
      const allKeys = Object.keys(allRates);
      const allRatesKeys = [];
      allRatesValuesSlice.forEach((x) => {
        const idx = Object.keys(allRates).findIndex((k) => {
          return x === allRates[k];
        });

        if (idx) {
          allRatesKeys.push(allKeys[idx]);
          console.log(allRatesKeys);
        }
      });

      document.getElementById("exchRate").innerHTML =
        arrayFromJson.rates[value1];

      chart.clear();
      chart.data.datasets.data = [];
      // chart.data.datasets = [
      //   {
      //     backgroundColor: [
      //       "#3e95cd",
      //       "#8e5ea2",
      //       "#3cba9f",
      //       "#e8c3b9",
      //       "#c45850",
      //     ],
      //     data: allRatesValuesSlice,
      //   },
      // ];
      chart.data.labels.pop();
      chart.data.datasets.forEach((dataset) => {
        dataset.data.pop();
      });
      chart.update();
      chart.config.data.datasets[0].data = allRatesValuesSlice;
      chart.config.data.labels = allRatesKeys;
      chart.update();
    } catch (e) {
      console.log(e);
      document.getElementById(
        "exchRate"
      ).innerHTML = `Wrong input: ${value1}. Try Again!`;
    }
  });
}

document.addEventListener("DOMContentLoaded", async (e) => mainEvent(e));
