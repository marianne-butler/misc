const margin = {top: 40, right: 0, bottom: 60, left: 40},
   width = 1160,
   height = 380,
   radiusMax = 20,
   metrics = ['total_album_consumption_millions', 'album_sales_millions', 'song_sales', 'on_demand_audio_streams_millions', 'on_demand_video_streams_millions'],
   artists = [];

   let bubbleChart, bubbleGroups, audioStreamsScale, videoStreamsScale, bubblesAreaScale, colorScale,
      colorList, areaLegend;

const createBubbleChart = function(data) {   

   bubbleChart = d3.select("#bubble-chart")
      .append('svg')
      .attr('viewbox', [0, 0, width, height])
      .attr('width', width)
      .attr('height', height);

   data.forEach(datum => {
      metrics.forEach(metric => {
         datum[metric] = parseFloat(datum[metric]);
      });
      artists.push(datum.artist);
   });

   audioStreamsScale = d3.scaleLinear()
      .domain([0, Math.ceil(d3.max(data, d => d.on_demand_audio_streams_millions))])
      .range([0, width - margin.left - margin.right]);


   videoStreamsScale = d3.scaleLinear()
      .domain([0, Math.ceil(d3.max(data, d => d.on_demand_video_streams_millions))])
      .range([height - margin.top - margin.bottom, 0]);

   bubblesAreaScale = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.album_sales_millions)])
      .range([0, Math.PI * Math.pow(radiusMax, 2)]);

   colorScale = d3.scaleOrdinal()
      .domain(artists)
      .range(d3.schemeTableau10);

   bubbleChart
      .append('g')
      .attr('transform', `translate(${margin.left}, ${height - margin.bottom - margin.top})`)
      .call(d3.axisBottom(audioStreamsScale));

   bubbleChart
      .append('g')
      .attr('transform', `translate(${margin.left}, 0)`)
      .call(d3.axisLeft(videoStreamsScale));

   bubbleChart
      .append('text')
      .attr('x', (width / 2) + margin.left)
      .attr('y', height - (margin.bottom / 2))
      .attr('text-anchor', 'middle')
      .text("On-demand Audio Streams (millions)");

   bubbleGroups = bubbleChart
      .selectAll('.bubble')
      .data(data)
      .join('g')
      .attr('class', 'bubble');

   bubbleGroups
      .append('circle')
      .attr('r', d => Math.sqrt(bubblesAreaScale(d.album_sales_millions) / Math.PI))
      .attr('cx',  d => audioStreamsScale(d.on_demand_audio_streams_millions))
      .attr('cy', d => videoStreamsScale(d.on_demand_video_streams_millions))
      .attr('fill', d => colorScale(d.artist));

   colorList = d3.select('.legend-color').append('ul');

   colorList.selectAll('li')
      .data(data)
      .join('li')

   colorList.selectAll('li')
      .append('span')
      .attr('class', 'legend-circle')
      .attr('style', d => `background-color: ${colorScale(d.artist)}`)

   colorList.selectAll('li')
      .append('span')
      .text(d => `${d.artist}, ${d.title}`);

   areaLegend = d3.select(".legend-area")
      .append('svg')
      .attr('viewbox', [0, 0, radiusMax * 12, radiusMax * 4])
      .attr('width', radiusMax * 12)
      .attr('height', radiusMax * 4);


   areaLegend
      .append("line")
      .attr('x1', 0)
      .attr('x2', radiusMax * 8)
      .attr('y1', radiusMax * 2)
      .attr('y2', radiusMax * 2)
      .attr('stroke', '#333');

   areaLegend.selectAll('g')
      .data([1.5, 0.5, 0.1])
      .join('g')

   areaLegend.selectAll('g')
      .append('circle')   
      .attr('cx', (d, i) => (i + 0.5) * radiusMax * 3)
      .attr('cy', radiusMax * 2)
      .attr('r', d => Math.sqrt(bubblesAreaScale(d) / Math.PI))
      .attr('fill', '#ccc');


   areaLegend.selectAll('g')
      .append('text')
      .attr('class', 'label')
      .attr('x', (d, i) => (i + 0.5) * radiusMax * 3)
      .attr('y', radiusMax * 4)
      .text(d => `${d} M`)
      .attr('text-anchor', 'middle');

}

d3.csv('../data/top_albums.csv').then(data => {
   createBubbleChart(data);
});