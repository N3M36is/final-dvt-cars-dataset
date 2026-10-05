// =============================
// Tooltip
// =============================
const tooltip = d3.select("body")
    .append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);
// =============================
// Universal Zoom Function
// =============================
function addZoom(svg, zoomLayer) {

    const zoom = d3.zoom()
        .scaleExtent([1, 10])
        .translateExtent([
            [-1000, -1000],
            [5000, 5000]
        ])
        .on("zoom", (event) => {
            zoomLayer.attr(
                "transform",
                event.transform
            );
        });

    svg.call(zoom);
}
// =============================
// Load CSV
// =============================
d3.csv("cars_dataset_cleaned.csv").then(data => {

    data.forEach(d => {
        d.listing_price = +d.listing_price || 0;
        d.odometer_km = +d.odometer_km || 0;
        d.vehicle_year = +d.vehicle_year || 0;
    });

    drawChart1(data);
    drawChart2(data);
    drawChart3(data);
    drawChart4(data);
});

// =============================
// CHART 1
// Make vs Average Listing Price
// =============================
function drawChart1(data) {

    d3.select("#chart1").selectAll("*").remove();

    const width = document.getElementById("chart1").clientWidth;
    const height = document.getElementById("chart1").clientHeight;

    const margin = {
        top: 80,
        right: 40,
        bottom: 100,
        left: 90
    };

    const svg = d3.select("#chart1")
        .append("svg")
        .attr("width", width)
        .attr("height", height);

    const zoomLayer = svg.append("g");

    const chartData = Array.from(
        d3.rollup(
            data,
            v => d3.mean(v, d => d.listing_price),
            d => d.make
        ),
        ([make, avg]) => ({
            make,
            avg
        })
    ).sort((a, b) => b.avg - a.avg);

    const x = d3.scaleBand()
        .domain(chartData.map(d => d.make))
        .range([margin.left, width - margin.right])
        .padding(0.3);

    const y = d3.scaleLinear()
        .domain([0, d3.max(chartData, d => d.avg)])
        .nice()
        .range([height - margin.bottom, margin.top]);

    // Title
    svg.append("text")
        .attr("x", width / 2)
        .attr("y", 35)
        .attr("text-anchor", "middle")
        .style("font-size", "26px")
        .style("font-weight", "bold")
        .text("Make vs Average Listing Price");

    // X Axis
    zoomLayer.append("g")
        .attr(
            "transform",
            `translate(0,${height - margin.bottom})`
        )
        .call(d3.axisBottom(x));

    // Y Axis
    zoomLayer.append("g")
        .attr(
            "transform",
            `translate(${margin.left},0)`
        )
        .call(d3.axisLeft(y));

    // Bars
    zoomLayer.selectAll(".bar")
        .data(chartData)
        .enter()
        .append("rect")
        .attr("class", "bar")
        .attr("x", d => x(d.make))
        .attr("width", x.bandwidth())
        .attr("y", height - margin.bottom)
        .attr("height", 0)
        .attr("fill", "#4e79a7")

        .on("mouseover", (event, d) => {
            tooltip
                .style("opacity", 1)
                .html(`
                    <strong>${d.make}</strong><br>
                    Average Price:
                    $${Math.round(d.avg).toLocaleString()}
                `);
        })

        .on("mousemove", event => {
            tooltip
                .style("left", (event.pageX + 10) + "px")
                .style("top", (event.pageY - 25) + "px");
        })

        .on("mouseout", () => {
            tooltip.style("opacity", 0);
        })

        .transition()
        .duration(1500)
        .attr("y", d => y(d.avg))
        .attr(
            "height",
            d => height - margin.bottom - y(d.avg)
        );

    // Price Label
    zoomLayer.selectAll(".price-label")
        .data(chartData)
        .enter()
        .append("text")
        .attr("class", "price-label")
        .attr(
            "x",
            d => x(d.make) + x.bandwidth() / 2
        )
        .attr(
            "y",
            height - margin.bottom
        )
        .attr("text-anchor", "middle")
        .attr("fill", "#111")
        .style("font-size", "12px")
        .style("font-weight", "bold")
        .text(
            d =>
            "$" +
            Math.round(d.avg).toLocaleString()
        )
        .transition()
        .duration(1500)
        .attr(
            "y",
            d => y(d.avg) - 10
        );

    // Make Label
    zoomLayer.selectAll(".make-label")
        .data(chartData)
        .enter()
        .append("text")
        .attr("class", "make-label")
        .attr(
            "x",
            d => x(d.make) + x.bandwidth() / 2
        )
        .attr(
            "y",
            height - margin.bottom
        )
        .attr("text-anchor", "middle")
        .attr("fill", "white")
        .style("font-size", "12px")
        .style("font-weight", "bold")
        .text(d => d.make)
        .transition()
        .duration(1500)
        .attr(
            "y",
            d => y(d.avg) + 20
        );

    // Zoom & Pan
    const zoom = d3.zoom()
        .scaleExtent([1, 10])
        .translateExtent([
            [-1000, -1000],
            [5000, 5000]
        ])
        .on("zoom", (event) => {
            zoomLayer.attr(
                "transform",
                event.transform
            );
        });

    svg.call(zoom);
}
// =============================
// CHART 2
// Odometer vs Listing Price
// Scatter Plot + Tooltip + Animation + Zoom
// =============================
function drawChart2(data) {

    d3.select("#chart2").selectAll("*").remove();

    const margin = {
        top: 80,
        right: 40,
        bottom: 80,
        left: 90
    };

    const width =
        document.getElementById("chart2").clientWidth;

    const height =
        document.getElementById("chart2").clientHeight;

    const svg = d3.select("#chart2")
        .append("svg")
        .attr("width", width)
        .attr("height", height);

    const zoomLayer = svg.append("g");

    const filteredData = data.filter(d =>
        d.odometer_km > 0 &&
        d.listing_price > 0
    );

    const x = d3.scaleLinear()
        .domain(
            d3.extent(
                filteredData,
                d => d.odometer_km
            )
        )
        .nice()
        .range([
            margin.left,
            width - margin.right
        ]);

    const y = d3.scaleLinear()
        .domain(
            d3.extent(
                filteredData,
                d => d.listing_price
            )
        )
        .nice()
        .range([
            height - margin.bottom,
            margin.top
        ]);

    // =============================
    // Title
    // =============================
    svg.append("text")
        .attr("x", width / 2)
        .attr("y", 35)
        .attr("text-anchor", "middle")
        .style("font-size", "26px")
        .style("font-weight", "bold")
        .text("Odometer vs Listing Price");

    // =============================
    // X Axis
    // =============================
    zoomLayer.append("g")
        .attr(
            "transform",
            `translate(0,${height - margin.bottom})`
        )
        .call(d3.axisBottom(x));

    // =============================
    // Y Axis
    // =============================
    zoomLayer.append("g")
        .attr(
            "transform",
            `translate(${margin.left},0)`
        )
        .call(d3.axisLeft(y));

    // =============================
    // X Label
    // =============================
    svg.append("text")
        .attr("x", width / 2)
        .attr("y", height - 20)
        .attr("text-anchor", "middle")
        .style("font-size", "16px")
        .style("font-weight", "bold")
        .text("Odometer (km)");

    // =============================
    // Y Label
    // =============================
    svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("x", -height / 2)
        .attr("y", 25)
        .attr("text-anchor", "middle")
        .style("font-size", "16px")
        .style("font-weight", "bold")
        .text("Listing Price ($)");

    // =============================
    // Scatter Points
    // =============================
    zoomLayer.selectAll(".dot")
        .data(filteredData)
        .enter()
        .append("circle")
        .attr("class", "dot")
        .attr("cx", d => x(d.odometer_km))
        .attr("cy", height - margin.bottom)
        .attr("r", 0)
        .attr("fill", "#4e79a7")
        .attr("opacity", 0.75)

        .on("mouseover", (event, d) => {

            tooltip
                .style("opacity", 1)
                .html(`
                    <strong>${d.make}</strong><br>
                    Odometer:
                    ${Math.round(
                        d.odometer_km
                    ).toLocaleString()} km<br>
                    Price:
                    $${Math.round(
                        d.listing_price
                    ).toLocaleString()}
                `);

        })

        .on("mousemove", event => {

            tooltip
                .style(
                    "left",
                    (event.pageX + 10) + "px"
                )
                .style(
                    "top",
                    (event.pageY - 25) + "px"
                );

        })

        .on("mouseout", () => {

            tooltip.style("opacity", 0);

        })

        .transition()
        .duration(1500)
        .delay((d, i) => i * 2)
        .attr("cy",
            d => y(d.listing_price)
        )
        .attr("r", 5);

    // =============================
    // Zoom & Pan
    // =============================
    const zoom = d3.zoom()
        .scaleExtent([1, 10])
        .translateExtent([
            [-1000, -1000],
            [5000, 5000]
        ])
        .on("zoom", (event) => {

            zoomLayer.attr(
                "transform",
                event.transform
            );

        });

    svg.call(zoom);
}
// =============================
// CHART 3
// Fuel Type Distribution Analysis
// =============================
function drawChart3(data) {

    d3.select("#chart3").selectAll("*").remove();

    const width = document.getElementById("chart3").clientWidth;
    const height = document.getElementById("chart3").clientHeight;

    const svg = d3.select("#chart3")
        .append("svg")
        .attr("width", width)
        .attr("height", height);

    const radius = Math.min(width, height) / 3;

    // Fuel Type Count
    const fuelData = Array.from(
        d3.rollup(
            data.filter(d =>
                (d.fuel_type && d.fuel_type.trim() !== "") ||
                (d.fuel && d.fuel.trim() !== "")
            ),
            v => v.length,
            d => d.fuel_type || d.fuel
        ),
        ([fuel, count]) => ({
            fuel,
            count
        })
    );

    const color = d3.scaleOrdinal()
        .domain(fuelData.map(d => d.fuel))
        .range(d3.schemeTableau10);

    svg.append("text")
        .attr("x", width / 2)
        .attr("y", 35)
        .attr("text-anchor", "middle")
        .style("font-size", "26px")
        .style("font-weight", "bold")
        .text("Fuel Type Distribution");

    const g = svg.append("g")
        .attr(
            "transform",
            `translate(${width / 2},${height / 2 + 40})`
        );

    const pie = d3.pie()
        .value(d => d.count)
        .sort(null);

    const arc = d3.arc()
        .innerRadius(0)
        .outerRadius(radius);

    const arcs = g.selectAll(".arc")
        .data(pie(fuelData))
        .enter()
        .append("g");

    arcs.append("path")
        .attr("fill", d => color(d.data.fuel))
        .attr("stroke", "#fff")
        .attr("stroke-width", 2)
        .on("mouseover", (event, d) => {

            const total = d3.sum(
                fuelData,
                item => item.count
            );

            const percent =
                ((d.data.count / total) * 100)
                .toFixed(1);

            tooltip
                .style("opacity", 1)
                .html(`
                    <strong>${d.data.fuel}</strong><br>
                    Count: ${d.data.count}<br>
                    ${percent}%
                `);
        })
        .on("mousemove", event => {

            tooltip
                .style("left",
                    `${event.pageX + 10}px`)
                .style("top",
                    `${event.pageY - 25}px`);
        })
        .on("mouseout", () => {

            tooltip.style("opacity", 0);
        })
        .transition()
        .duration(1500)
        .attrTween("d", function(d) {

            const i = d3.interpolate(
                { startAngle: 0, endAngle: 0 },
                d
            );

            return function(t) {
                return arc(i(t));
            };
        });

    // Labels
    arcs.append("text")
        .attr("transform",
            d => `translate(${arc.centroid(d)})`)
        .attr("text-anchor", "middle")
        .style("fill", "white")
        .style("font-size", "12px")
        .style("font-weight", "bold")
        .text(d => {

    const total = d3.sum(
        fuelData,
        item => item.count
    );

    const percent =
        ((d.data.count / total) * 100)
        .toFixed(1);

    return `${d.data.fuel} ${percent}%`;
});

    // Legend
    const legend = svg.append("g")
        .attr("transform", "translate(30,70)");

    fuelData.forEach((d, i) => {

        legend.append("rect")
            .attr("x", 0)
            .attr("y", i * 25)
            .attr("width", 15)
            .attr("height", 15)
            .attr("fill", color(d.fuel));

        legend.append("text")
            .attr("x", 25)
            .attr("y", i * 25 + 12)
            .style("font-size", "13px")
            .text(`${d.fuel} (${d.count})`);
    });

}
// =============================
// CHART 4
// Year vs Average Odometer
// Line Chart + Tooltip + Animation + Zoom
// =============================
function drawChart4(data) {

    d3.select("#chart4").selectAll("*").remove();

    const margin = {
        top: 80,
        right: 40,
        bottom: 80,
        left: 90
    };

    const width =
        document.getElementById("chart4").clientWidth;

    const height =
        document.getElementById("chart4").clientHeight;

    const svg = d3.select("#chart4")
        .append("svg")
        .attr("width", width)
        .attr("height", height);

    const zoomLayer = svg.append("g");

    // =============================
    // Average Odometer By Year
    // =============================
    const chartData = Array.from(
        d3.rollup(
            data.filter(d =>
                d.vehicle_year > 0 &&
                d.odometer_km > 0
            ),
            v => d3.mean(
                v,
                d => d.odometer_km
            ),
            d => d.vehicle_year
        ),
        ([year, avgOdometer]) => ({
            year,
            avgOdometer
        })
    )
    .sort((a, b) => a.year - b.year);

    const x = d3.scaleLinear()
        .domain(
            d3.extent(
                chartData,
                d => d.year
            )
        )
        .range([
            margin.left,
            width - margin.right
        ]);

    const y = d3.scaleLinear()
        .domain([
            0,
            d3.max(
                chartData,
                d => d.avgOdometer
            )
        ])
        .nice()
        .range([
            height - margin.bottom,
            margin.top
        ]);

    // =============================
    // Title
    // =============================
    svg.append("text")
        .attr("x", width / 2)
        .attr("y", 35)
        .attr("text-anchor", "middle")
        .style("font-size", "26px")
        .style("font-weight", "bold")
        .text(
            "Vehicle Age and Usage Trend Analysis"
        );

    // =============================
    // X Axis
    // =============================
    zoomLayer.append("g")
        .attr(
            "transform",
            `translate(
                0,
                ${height - margin.bottom}
            )`
        )
        .call(
            d3.axisBottom(x)
                .tickFormat(d3.format("d"))
        );

    // =============================
    // Y Axis
    // =============================
    zoomLayer.append("g")
        .attr(
            "transform",
            `translate(${margin.left},0)`
        )
        .call(d3.axisLeft(y));

    // =============================
    // X Label
    // =============================
    svg.append("text")
        .attr(
            "x",
            width / 2
        )
        .attr(
            "y",
            height - 20
        )
        .attr(
            "text-anchor",
            "middle"
        )
        .style(
            "font-size",
            "16px"
        )
        .style(
            "font-weight",
            "bold"
        )
        .text("Vehicle Year");

    // =============================
    // Y Label
    // =============================
    svg.append("text")
        .attr(
            "transform",
            "rotate(-90)"
        )
        .attr(
            "x",
            -height / 2
        )
        .attr(
            "y",
            25
        )
        .attr(
            "text-anchor",
            "middle"
        )
        .style(
            "font-size",
            "16px"
        )
        .style(
            "font-weight",
            "bold"
        )
        .text(
            "Average Odometer (km)"
        );

    // =============================
    // Line Generator
    // =============================
    const line = d3.line()
        .x(d => x(d.year))
        .y(d =>
            y(d.avgOdometer)
        );

    // =============================
    // Draw Line
    // =============================
    const path = zoomLayer.append("path")
        .datum(chartData)
        .attr("fill", "none")
        .attr("stroke", "#4e79a7")
        .attr("stroke-width", 4)
        .attr("d", line);

    // =============================
    // Line Animation
    // =============================
    const totalLength =
        path.node().getTotalLength();

    path
        .attr(
            "stroke-dasharray",
            totalLength
        )
        .attr(
            "stroke-dashoffset",
            totalLength
        )
        .transition()
        .duration(2000)
        .attr(
            "stroke-dashoffset",
            0
        );

    // =============================
    // Points
    // =============================
    zoomLayer.selectAll(".point")
        .data(chartData)
        .enter()
        .append("circle")
        .attr("class", "point")
        .attr(
            "cx",
            d => x(d.year)
        )
        .attr(
            "cy",
            d => y(d.avgOdometer)
        )
        .attr("r", 0)
        .attr("fill", "#e15759")

        .on(
            "mouseover",
            (event, d) => {

                tooltip
                    .style(
                        "opacity",
                        1
                    )
                    .html(`
                        <strong>${d.year}</strong><br>
                        Average Odometer:
                        ${Math.round(
                            d.avgOdometer
                        ).toLocaleString()} km
                    `);

            }
        )

        .on(
            "mousemove",
            event => {

                tooltip
                    .style(
                        "left",
                        (event.pageX + 10) + "px"
                    )
                    .style(
                        "top",
                        (event.pageY - 25) + "px"
                    );

            }
        )

        .on(
            "mouseout",
            () => {

                tooltip
                    .style(
                        "opacity",
                        0
                    );

            }
        )

        .transition()
        .delay((d, i) => i * 100)
        .duration(500)
        .attr("r", 6);

    // =============================
    // Data Labels
    // =============================
    zoomLayer.selectAll(".year-label")
        .data(chartData)
        .enter()
        .append("text")
        .attr(
            "class",
            "year-label"
        )
        .attr(
            "x",
            d => x(d.year)
        )
        .attr(
            "y",
            d => y(d.avgOdometer) - 10
        )
        .attr(
            "text-anchor",
            "middle"
        )
        .style(
            "font-size",
            "11px"
        )
        .style(
            "font-weight",
            "bold"
        )
        .style(
            "fill",
            "#333"
        )
        .text(
            d =>
            Math.round(
                d.avgOdometer
            ).toLocaleString()
        );

    // =============================
    // Zoom & Pan
    // =============================
    const zoom = d3.zoom()
        .scaleExtent([1, 10])
        .translateExtent([
            [-1000, -1000],
            [5000, 5000]
        ])
        .on(
            "zoom",
            (event) => {

                zoomLayer.attr(
                    "transform",
                    event.transform
                );

            }
        );

    svg.call(zoom);
}