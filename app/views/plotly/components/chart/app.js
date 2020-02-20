function createReactChart(container, chartsList) {
  const myNode = document.getElementById(container);
  ReactDOM.unmountComponentAtNode(myNode)
  ReactDOM.render(React.createElement(Chart, chartsList), document.getElementById(container))
}

function param(variable) {
  var query = window.location.search.substring(1);
  var vars = query.split('&');
  for (var i = 0; i < vars.length; i++) {
    var pair = vars[i].split('=');
    if (decodeURIComponent(pair[0]) == variable) {
      return decodeURIComponent(pair[1]);
    }
  }
  console.log('Query variable %s not found', variable);
  return undefined;
}


let draw = (containerId, input,sha) => {
  let array = []
  if(input.charts){
    input = input.charts
  }
  input.map(async (chart) => {
    array.push(new Promise(async (resolve,reject)=>{
      let data = await axios.get(chart.traces.replace(":sha",sha).replace("{host}", SERVER_URL)).then((response) => response.data)
      let layout = await axios.get(chart.template.replace(":sha",sha).replace("{host}", SERVER_URL)).then((response) => response.data)
      let mergedLayout = _.merge({}, darkLayout, layout);
      delete layout.traces
      resolve({
        data:data,
        layout:mergedLayout
      })
    }))
  })

  Promise.all(array).then((values)=> {
    createReactChart(containerId, {charts:[...values]});
  });
}

async function init () {
  let template = param('template')
  let sha = param('sha')
  if(template && sha) {
    let input = await axios.get(template).then(resp=>resp.data)
    draw('main-view', input,sha)
  }
  window.eventBus.on('draw-charts', async (e) => {
    if(e.url){
      let input = await axios.get(e.url).then(resp=>resp.data)
      draw('main-view', input,e.sha)
    } else {
      draw('main-view', e.template ,e.sha)
    }
  });
}
init()
