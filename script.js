let data = d3.csv('wealth-health-2014.csv', d3.autoType).then (data =>{
    console.log('data.columns', data[0]);

    d3.select('.chart').append('svg');


    const margin = ({top: 20, bottom: 20, left: 20, right: 20});
    const width = 650 - margin.left - margin.right;
        height = 500 - margin.top - margin.bottom;

    
    const xScale = d3
        .scaleLog()
        .domain(d3.extent(data, d=> d.Income))
        .range([0, width])

    const yScale = d3
        .scaleLinear()
        .domain(d3.extent(data, d=> d.LifeExpectancy))
        .range([height, 0]);
            

    const xAxis = d3.axisBottom()
        .scale(xScale)
        .ticks(10, 's');//fill in something here
    const yAxis = d3.axisLeft()
        .scale(yScale)
        .ticks(10,'s');//input something here

    const sizeScale = d3
        .scaleLinear()
        .domain(d3.extent(data, d=> d.Population))
        .range([4,18]);

    const colorScale = d3  
        .scaleOrdinal(d3.schemeTableau10);   

    const svg = d3.select('.chart').append('svg')
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")"

        );

    svg.selectAll('circle')
        .data(data)
        .enter()
        .append('circle')
        .attr('fill', d => colorScale(d.Region))
        .attr('stroke', 'black')
        .attr('opacity', .9)
        .attr('r', d=> sizeScale(d.Population))
        .attr('cy', d=> yScale(d.LifeExpectancy))
        .attr('cx', d=> xScale(d.Income))
        .on("mouseenter", (event, d)=>{
            const pos = d3.pointer(event, window)
            tooltip = d3.select('.tooltip')
                .style('display', 'block')
                .style('position', 'absolute')
                .style('top', pos[1] + 'px')
                .style('left', pos[0] + 'px')
                .html(`<p>
                Country: ${d.Country} <br>
                Region: ${d.Region} <br>
                Population: ${d.Population} <br>
                Income: ${d.Income} <br>
                LifeExpectancy: ${d.LifeExpectancy}
                
                </p>`);
        })
        .on('mouseleave', (event,d)=>{
            d3.select('.tooltip')
                .style('display', 'none');

        })

    svg.append("g")
        .attr("class", "axis x-axis")
        .call(xAxis)
        .attr('transform', `translate(0, ${height})`);

    svg.append('g')
        .attr('class', 'axis y-axis')
        .call(yAxis);

    svg.append('text')
        .attr('x', width - 30)
        .attr('y', height - 20)
        .text('Income');

    svg.append('text')
        .attr('x', 10)
        .attr('y',+10)
        .text('Life Expectancy')
        .style('writing-mode', 'vertical-lr');



    
    let legend = svg.selectAll('rect')
        .data(colorScale.domain())
        .enter()
        .append('rect')
        .attr('x', width - 100)
        .attr('y', (d,i) => i * 20+300)
        .attr('height', 15)
        .attr('width', 15)
        .attr('fill', d=> colorScale(d));
    
    let labels = svg.selectAll('legendLabel')
        .data(colorScale.domain())
        .enter()
        .append('text')
        .attr('x', width - 80)
        .attr('y', (d,i) => i * 20+310)
        .attr('class', 'region')
        .text(d=>d);

})
