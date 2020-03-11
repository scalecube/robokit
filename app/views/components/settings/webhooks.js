import React from 'react'
import MaterialTable from 'material-table'
import axios from 'axios'

class Webhooks extends React.Component {

  constructor (props) {
    super(props)
    this.state = {
      columns: [
        { title: 'Owner', field: 'owner' },
        { title: 'Repo', field: 'repo' },
        { title: 'URL', field: 'url' },
      ],
      data: [],
      options: {
        search: true,
        toolbar: true,
        paging: false,
        headerStyle: { backgroundColor: '#f0f0f0', padding: '5px' }, //change header padding
        //cellStyle:{ padding: '5px'} here not work for me
      }
    }
    this.setData()
  }

  setData () {
    window.eventBus.on('settings-init', (e) => {
      this.refresh()
    })
  }

  refresh () {
    axios.get(`/webhooks/`)
      .then(resp => {
        let webhooks = resp.data
        let data = []
        webhooks.forEach(hook => {
          data.push({ url: hook.url, owner: hook.owner, repo: hook.repo, _id: hook._id })
        })
        this.setState({ data }, () => {})
      }).catch(err => {
      this.login(err)
    })
  }

  login (err) {
    if (err.message.includes('403'))
      document.location.href = '/auth/github/'

  }

  render () {

    return <div>

      <MaterialTable
        title="Webhook Settings"
        columns={this.state.columns}
        data={this.state.data}
        options={this.state.options}
        editable={{
          onRowAdd: newData => new Promise((resolve, reject) => {
            axios.post('/webhooks/', newData).then((resp) => {
              this.refresh()
              resolve()
            }).catch(err => {
              this.refresh()
              resolve()
            })
          }),
          onRowUpdate: (newData, oldData) => new Promise((resolve, reject) => {
            axios.post('/webhooks/', newData).then((resp) => {
              this.refresh()
              resolve()
            }).catch(err => {
              this.refresh()
              resolve()
            })
          }),
          onRowDelete: oldData => new Promise((resolve, reject) => {
            axios.delete(`/webhooks/${oldData._id}`, oldData).then((resp) => {
              this.refresh()
              resolve()
            }).catch(err => {
              this.refresh()
              resolve()
            })
          }),
        }}
      />

    </div>
  }
}

export default Webhooks