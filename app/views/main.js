import React from "react";
import ReactDOM from "react-dom";
import MUIDataTable from "mui-datatables";
import {CopyToClipboard} from 'react-copy-to-clipboard';
import createReactSettings from './components/settings/app'
import menu from './components/side-menu/menu.js'
require ('./components/chart/app.js')
import UserSearch from './user-search/user-search';


ReactDOM.render(<UserSearch />, document.getElementById('main-view'));