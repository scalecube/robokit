import React from "react";
import ReactDOM from "react-dom";
import axios from 'axios';
import _ from 'lodash'
import darkLayout from './dark-layout'
import Chart from './Charts'

function createReactChart(container, chartsList) {
  const myNode = document.getElementById(container);
  ReactDOM.unmountComponentAtNode(myNode)
  ReactDOM.render(React.createElement(Chart, chartsList), document.getElementById(container))
}

function param(variable) {
  let query = window.location.search.substring(1);
  let vars = query.split('&');
  for (let i = 0; i < vars.length; i++) {
    let pair = vars[i].split('=');
    if (decodeURIComponent(pair[0]) == variable) {
      return decodeURIComponent(pair[1]);
    }
  }
  console.log('Query variable %s not found', variable);
  return undefined;
}


let draw = (containerId, template, sha) => {
  let array = []
  if(template.charts){
    template = template.charts
  }
  template.map((chart) => {
    let SERVER_URL = window.location.origin

    array.push(new Promise((resolve,reject) => {

      let dataPromise = axios.get(chart.traces.replace(":sha",sha).replace("{host}", SERVER_URL))
        .catch(err=> {
          login(err)
        })

      let layoutPromise = axios.get(chart.template.replace(":sha",sha).replace("{host}", SERVER_URL))
        .catch(err=> {
          login(err)
        })

      Promise.all([dataPromise,layoutPromise]).then(value => {
        let data = value[0].data
        let layout = value[1].data
        let mergedLayout = _.merge({}, darkLayout, layout);
        delete layout.traces
        resolve({
          data:data,
          layout:mergedLayout
        })
      })
    }))
  })

  Promise.all(array).then((values)=> {
    createReactChart(containerId, {charts:[...values]});
  });
}

function login(err) {
  if(err.message.includes("403"))
    document.location.href = "/auth/github/";
}

function init () {
  let template = param('template')
  let sha = param('sha')
  if(template && sha) {
    axios.get(`/templates/${template}`).then(resp => {
      let template = resp.data
      draw('main-view', template[0],sha)
    }).catch(err=> {
        login(err)
    })

  }
  window.eventBus.on('draw-charts', (e) => {
    if(e.url) {
      axios.get(e.url)
        .then(resp => {
            draw('main-view', resp.data, e.sha)
        }).catch(login)
    } else {
      draw('main-view', e.template ,e.sha)
    }
  });
}
init()
