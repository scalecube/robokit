class PullRequest {
  createPullRequest (ctx) {
    this.openPullRequest(ctx, {
      source: {
        owner: 'scalecube',
        repo: 'cicd-template',
        files: 'template-index.json'
      },
      pr: {
        body: 'Install ci-cd template files on the repository this will enable CI and packaging',
        title: 'Install ci-cd template files'
      },
      branch: 'install-CI-files'
    })
  }

  async openPullRequest (context, request) {
    const branch = request.branch // your branch's name
    const reference = await context.github.gitdata.getRef(context.repo({ ref: 'heads/master' })) // get the reference for the master branch
    const sha = reference.data.object.sha // reference master sha.

    const ref = await this._getOrCreateRef(context, branch, reference.data.object.sha)
    const resp = await this.content(request.source.owner, request.source.repo, request.source.files, false)
    const files = JSON.parse(resp)

    files.forEach(async (file) => {
      const content = await this.content(request.source.owner, request.source.repo, file, true)
      try {
        const result = await context.github.repos.createOrUpdateFile(context.repo({
          path: file, // the path to your config file
          message: `adds ${file}`, // a commit message
          content,
          branch,
          sha: sha
        })) // create your config file
      } catch (e) {
        console.info(e.message)
      }
      try {
        return await context.github.pullRequests.create(context.repo({
          title: request.pr.title, // the title of the PR
          head: branch,
          base: 'master', // where you want to merge your changes
          body: request.pr.body, // the body of your PR,
          maintainer_can_modify: true // allows maintainers to edit your app's PR
        }))
      } catch (err) {
        console.error(err)
      }
    })
  }
  ;
  async _getOrCreateRef (context, branch, sha) {
    const repo = context.payload.repository.name
    const owner = context.payload.repository.owner.login
    let reference

    const get = await context.github.gitdata.listRefs({
      owner,
      repo
    }).then(result => {
      result.data.forEach(ref => {
        if (ref.ref === `refs/heads/${branch}`) {
          reference = ref
          sha = sha
        }
      })
      if (!reference) {
        // create a reference in git for your branch
        context.github.gitdata.createRef(context.repo({
          ref: `refs/heads/${branch}`,
          sha: sha
        })).then(result => {
          reference = result
        }).catch(err => {
          console.error(err)
        }) // create a reference in git for your branch
      }
    }) // create a reference in git for your branch

    return reference
  }

  _formatComment (msg) {
    let body = msg.body
    Object.entries(msg).forEach((e) => {
      body = body.replace('${' + e[0] + '}', e[1])
    })
    return body
  }
}
