const margin = {top: 30, right: 20, bottom: 50, left: 60};
const width = 1200;
const height = 600;
const padding = 1;
const color = 'steelblue';


const createHistogram = function(earnings) {
	const bin = d3.bin(),
		buckets = bin(earnings),
		xScale = d3.scaleLinear()
      		.domain([0, d3.max(buckets, d => d.x1)])
      		.range([0, width - margin.left - margin.right]);
      	yScale = d3.scaleLinear()
      		.domain([d3.max(buckets, d => d.length) + 0.5, 0])
      		.range([0, height - margin.top - margin.bottom]),
      	chart = d3.select('#viz')
      		.append('svg')
      		.attr('viewbox', [0, 0, width, height])
      		.attr('width', width)
      		.attr('height', height),
      	itemX = d => margin.left + xScale(d.x0)
      	itemMidX = d =>  margin.left + xScale(d.x0 + ((d.x1 - d.x0) / 2))
      	itemY = d => yScale(d.length),
      	curvePoints = buckets.map(d => [itemMidX(d), itemY(d)]),
      	lineGenerator = d3.line().curve(d3.curveCardinal),
      	areaGenerator = d3.area().curve(d3.curveCardinal)
      		.x(d => itemMidX(d))
        	.y0(yScale(0))
        	.y1(d => itemY(d));
     
      	let groups;

      	chart
      		.append('g')
      		.attr('transform', `translate(${margin.left}, ${height - margin.bottom - margin.top})`)
      		.call(d3.axisBottom(xScale));

    	chart
      		.append('g')
      		.attr('transform', `translate(${margin.left}, 0)`)
      		.call(d3.axisLeft(yScale));

      	groups = chart
      		.selectAll('.bin')
      		.data(buckets)
      		.join('g')
      		.attr('class', 'bin'); 

      	groups
      		.append('rect')
      		.attr('x', d => itemX(d))
      		.attr('y', d => itemY(d))
      		.attr('width', d => xScale(d.x1 - d.x0 - padding))
      		.attr('height', d => height - margin.top - margin.bottom - itemY(d))

      	chart
      		.append('path')
      		.attr('d', lineGenerator(curvePoints))
      		.attr('stroke', '#FF10F0')
      		.attr('fill', 'transparent')
      		.attr('stroke-width', '2');

      	chart
      		.append('path')
      		.attr('d', areaGenerator(buckets))
      		.attr('fill', 'yellow')
      		.attr('fill-opacity', 0.2)

};

d3.csv('../data/pay_by_gender_tennis.csv').then(function(data) {
	createHistogram(data.map(d => parseFloat(d['earnings_USD_2019'].replace(",", ""))));
});