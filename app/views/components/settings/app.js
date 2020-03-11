import React from "react";
import ReactDOM from "react-dom";
import Webhooks from "./webhooks";
import axios from 'axios';

class Settings extends React.Component {

  constructor (props) {
    super(props)
  }

  render () {

    return <div className="menu-item-settings">
      <Webhooks/>
    </div>
  }
}

function createReactSettings(container) {
  ReactDOM.unmountComponentAtNode( document.getElementById(container))
  ReactDOM.render(React.createElement(Settings), document.getElementById(container))
}

window.eventBus.on('draw-settings', (e) => {
    createReactSettings('main-view')

    window.eventBus.emit('settings-init')
})

module.exports = createReactSettings