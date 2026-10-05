// ==============================
// LOAD CSV
// ==============================

Papa.parse("cars_dataset_cleaned.csv", {
    download: true,
    header: true,

    complete: function (results) {

        const data = results.data;

        data.forEach(d => {
            d.listing_price = +d.listing_price || 0;
            d.odometer_km = +d.odometer_km || 0;
            d.vehicle_year = +d.vehicle_year || 0;
        });

        createChart1(data);
        createChart2(data);
        createChart3(data);
        createChart4(data);
    }
});

// ==============================
// ZOOM CONFIG
// ==============================

function zoomOption() {

    return {

        pan: {
            enabled: true,
            mode: "xy"
        },

        zoom: {

            wheel: {
                enabled: true
            },

            pinch: {
                enabled: true
            },

            drag: {
                enabled: true
            },

            mode: "xy"
        }
    };
}

// ==============================
// CHART 1
// Make vs Average Listing Price
// ==============================

function createChart1(data) {

    const grouped = {};

    data.forEach(d => {

        if (!d.make || d.listing_price <= 0) return;

        if (!grouped[d.make]) {
            grouped[d.make] = [];
        }

        grouped[d.make].push(d.listing_price);
    });

    const labels = [];
    const values = [];

    Object.entries(grouped).forEach(([make, prices]) => {

        const avg =
            prices.reduce((a, b) => a + b, 0) /
            prices.length;

        labels.push(make);
        values.push(avg.toFixed(0));
    });

    new Chart(
        document.getElementById("chart1"),
        {
            type: "bar",

            data: {

                labels: labels,

                datasets: [{
                    label: "Average Listing Price ($)",
                    data: values,
                    backgroundColor: "#4e79a7",
                    borderColor: "#2f5f95",
                    borderWidth: 1
                }]
            },

            options: {

                responsive: true,

                animation: {
                    duration: 2000
                },

                plugins: {

                    title: {
                        display: true,
                        text: "Make vs Average Listing Price"
                    },

                    zoom: zoomOption(),

                    tooltip: {

                        callbacks: {

                            label: function(context) {

                                return (
                                    "$" +
                                    Number(
                                        context.raw
                                    ).toLocaleString()
                                );
                            }
                        }
                    }
                },

                scales: {

                    y: {

                        beginAtZero: true,

                        title: {
                            display: true,
                            text: "Price ($)"
                        }
                    },

                    x: {

                        title: {
                            display: true,
                            text: "Make"
                        }
                    }
                }
            }
        }
    );
}

// ==============================
// CHART 2
// Odometer vs Listing Price
// Scatter Plot
// ==============================

function createChart2(data) {

    const scatterData =
        data
        .filter(
            d =>
            d.odometer_km > 0 &&
            d.listing_price > 0
        )
        .map(d => ({
            x: d.odometer_km,
            y: d.listing_price
        }));

    new Chart(
        document.getElementById("chart2"),
        {

            type: "scatter",

            data: {

                datasets: [{
                    label: "Vehicles",
                    data: scatterData,
                    backgroundColor: "#e15759",
                    pointRadius: 4,
                    pointHoverRadius: 7
                }]
            },

            options: {

                responsive: true,

                animation: {
                    duration: 2500
                },

                plugins: {

                    title: {
                        display: true,
                        text: "Odometer vs Listing Price"
                    },

                    zoom: zoomOption()
                },

                scales: {

                    x: {

                        title: {
                            display: true,
                            text: "Odometer (km)"
                        }
                    },

                    y: {

                        title: {
                            display: true,
                            text: "Listing Price ($)"
                        }
                    }
                }
            }
        }
    );
}

// ==============================
// CHART 3
// Fuel Distribution Pie Chart
// ==============================

function createChart3(data) {

    const fuelCount = {};

    data.forEach(d => {

        const fuel =
            d.fuel_type ||
            d.fuel;

        if (!fuel) return;

        fuelCount[fuel] =
            (fuelCount[fuel] || 0) + 1;
    });

    const labels = Object.keys(fuelCount);
    const values = Object.values(fuelCount);

    new Chart(
        document.getElementById("chart3"),
        {

            type: "pie",

            data: {

                labels: labels,

                datasets: [{

                    data: values,

                    backgroundColor: [
                        "#4e79a7",
                        "#f28e2b",
                        "#e15759",
                        "#76b7b2",
                        "#59a14f",
                        "#edc949",
                        "#af7aa1",
                        "#ff9da7",
                        "#9c755f",
                        "#bab0ab"
                    ]
                }]
            },

            options: {

                responsive: true,

                animation: {

                    animateRotate: true,
                    duration: 2000
                },

                plugins: {

                    title: {
                        display: true,
                        text: "Fuel Type Distribution"
                    },

                    legend: {
                        position: "right"
                    }
                }
            }
        }
    );
}

// ======================================
// CHART 4
// Vehicle Age and Usage Trend Analysis
// Year vs Average Odometer
// ======================================

function createChart4(data) {

    // --------------------------
    // Group Data by Vehicle Year
    // --------------------------

    const grouped = {};

    data.forEach(d => {

        if (
            d.vehicle_year > 0 &&
            d.odometer_km > 0
        ) {

            if (!grouped[d.vehicle_year]) {
                grouped[d.vehicle_year] = [];
            }

            grouped[d.vehicle_year].push(
                d.odometer_km
            );
        }
    });

    // --------------------------
    // Calculate Average Odometer
    // --------------------------

    const years = Object.keys(grouped)
        .map(Number)
        .sort((a, b) => a - b);

    const avgOdometer = years.map(year => {

        const values = grouped[year];

        return (
            values.reduce(
                (sum, value) => sum + value,
                0
            ) / values.length
        );
    });

    // --------------------------
    // Build Chart
    // --------------------------

    new Chart(
        document.getElementById("chart4"),
        {

            type: "line",

            data: {

                labels: years,

                datasets: [

                    {

                        label: "Average Odometer (km)",

                        data: avgOdometer,

                        borderColor: "#4e79a7",

                        backgroundColor:
                            "rgba(78,121,167,0.2)",

                        fill: true,

                        tension: 0.4,

                        borderWidth: 4,

                        pointRadius: 7,

                        pointHoverRadius: 12,

                        pointHitRadius: 25,

                        pointBackgroundColor:
                            "#e15759",

                        pointBorderColor:
                            "#ffffff",

                        pointBorderWidth: 2
                    }
                ]
            },

            options: {

                responsive: true,

                maintainAspectRatio: false,

                interaction: {

                    mode: "nearest",

                    axis: "x",

                    intersect: true
                },

                animation: {

                    duration: 2500,

                    easing: "easeOutQuart"
                },

                plugins: {

                    title: {

                        display: true,

                        text:
                            "Vehicle Age and Usage Trend Analysis",

                        font: {

                            size: 22,

                            weight: "bold"
                        }
                    },

                    legend: {

                        display: true,

                        position: "top"
                    },

                    tooltip: {

                        enabled: true,

                        intersect: true,

                        callbacks: {

                            title: function(context) {

                                return (
                                    "Year : " +
                                    context[0].label
                                );
                            },

                            label: function(context) {

                                return (
                                    "Average Odometer : " +
                                    Math.round(
                                        context.raw
                                    ).toLocaleString() +
                                    " km"
                                );
                            }
                        }
                    },

                    zoom: {

                        pan: {

                            enabled: true,

                            mode: "xy"
                        },

                        zoom: {

                            wheel: {
                                enabled: true
                            },

                            pinch: {
                                enabled: true
                            },

                            drag: {
                                enabled: true
                            },

                            mode: "xy"
                        }
                    }
                },

                scales: {

                    x: {

                        title: {

                            display: true,

                            text: "Vehicle Year",

                            font: {
                                size: 16
                            }
                        },

                        ticks: {

                            autoSkip: false
                        },

                        grid: {

                            color:
                                "rgba(0,0,0,0.08)"
                        }
                    },

                    y: {

                        beginAtZero: true,

                        title: {

                            display: true,

                            text:
                                "Average Odometer (km)",

                            font: {
                                size: 16
                            }
                        },

                        ticks: {

                            callback: function(value) {

                                return value.toLocaleString();
                            }
                        },

                        grid: {

                            color:
                                "rgba(0,0,0,0.08)"
                        }
                    }
                }
            }
        }
    );
}