# Robokit

A GitHub App that automates Continuous Deployment (CD) by listening to GitHub check run events and triggering deployments through an environment service.

When a designated CI check run completes successfully on a protected branch (`develop` or `master`), Robokit calls out to an environment service over WebSocket, streams the deployment log back, and updates the GitHub check run with live status — all visible directly in the GitHub UI on the commit.

---

## How it works

```
GitHub CI check run completes
         │
         ▼
Robokit receives check_run webhook
         │
         ├─ Is branch "develop" or "master"? ──No──▶ ignore
         │
         ├─ Is check run named "robokit-deploy"? ──No──▶ ignore
         │
         ▼
Create GitHub Check Run  ("Robokit CD" — Starting)
Create GitHub Deployment (in_progress)
         │
         ▼
Send deploy request to Environment Service (WebSocket)
         │
         ├─ Stream log events back ──▶ update GitHub Check Run
         │
         ├─ On error  ──▶ cancel Check Run, set Deployment inactive
         │
         └─ On success ──▶ complete Check Run, set Deployment success
```

Users can also manually trigger or cancel a deployment by clicking the **Re-Deploy** or **Cancel-Deploy** buttons on the GitHub check run.

---

## Architecture

```
robokit.js          Startup: Vault auth (prod) or .env (LOCAL_DEV)
index.js            Probot event routing — check_run, installation

app/
  coordinator.js    Orchestration: decide, sequence, error handling
  context.js        Pure transforms: webhook payload → deploy object
  check-run.js      GitHub Check Run adapter (create / update)
  deployment.js     GitHub Deployments adapter (create / status)
  environment.js    Environment Service WebSocket adapter
  config.js         Constants and check run templates
  cache.js          Octokit instance cache (owner/repo → client)
  vault-api.js      HashiCorp Vault HTTP client

  statuses/
    starting.md     Check run output template — deployment starting
    canceled.md     Check run output template — deployment canceled
    status.md       Check run output template — deployment log
```

---

## Prerequisites

- **Node.js** >= 18
- A **GitHub App** installed on the target repositories
- An **Environment Service** reachable over WebSocket (`wss://`)
- **Production only:** HashiCorp Vault with Kubernetes auth, reachable from the pod

---

## GitHub App setup

1. Go to **GitHub → Settings → Developer settings → GitHub Apps → New GitHub App**
2. Set the webhook URL to your public endpoint (or smee.io proxy for local dev):
   ```
   https://your-domain.com/api/github/webhooks
   ```
3. Enable the following **permissions**:
   - Checks: Read & Write
   - Deployments: Read & Write
   - Contents: Read
4. Subscribe to the following **events**:
   - Check run
   - Installation
5. Generate and download the **private key** — this becomes `PRIVATE_KEY` in your config
6. Note the **App ID** shown on the app settings page — this becomes `APP_ID`
7. Note the **Webhook Secret** you set — this becomes `WEBHOOK_SECRET`
8. Install the app on the target org/repos and note the **Installation ID** from the URL:
   ```
   https://github.com/organizations/<org>/settings/installations/<INSTALLATION_ID>
   ```

---

## Configuration

All configuration is read from environment variables. In production these are loaded from Vault. For local development, copy the values into a `.env` file at the project root.

### Required — GitHub App

| Variable | Description |
|---|---|
| `APP_ID` | GitHub App ID (shown on the App settings page) |
| `PRIVATE_KEY` | RSA private key for the GitHub App (PEM format, newlines as `\n`) |
| `WEBHOOK_SECRET` | Secret used to sign and verify incoming webhooks |

### Required — Environment Service

| Variable | Description |
|---|---|
| `ENV_SERVICE_ADDRESS` | WebSocket URL of the environment service, e.g. `wss://env-service.example.com` |
| `ENV_SERVICE_ROLE` | OIDC role name used to obtain an env-service token from Vault |

### Required — Vault (production only, ignored when `LOCAL_DEV=true`)

| Variable | Description |
|---|---|
| `VAULT_ADDR` | Vault server URL, e.g. `https://vault.example.com` |
| `VAULT_ROLE` | Kubernetes auth role name used to log in to Vault |
| `VAULT_JWT_PROVIDER` | Vault Kubernetes auth mount path, e.g. `kubernetes-nexus` |
| `VAULT_JWT_PATH` | Path to the Kubernetes service account JWT token file. Default: `/var/run/secrets/kubernetes.io/serviceaccount/token` |
| `VAULT_SECRETS_PATH` | Vault KV path that contains all other secrets, e.g. `secretv2/scalecube/robokit/prod` |

At startup, Robokit logs into Vault using the pod's service account JWT, reads all secrets from `VAULT_SECRETS_PATH`, and injects them into `process.env` before starting the server. This means every other variable (`APP_ID`, `PRIVATE_KEY`, `WEBHOOK_SECRET`, etc.) can live in Vault and be omitted from the pod spec.

### Optional — Server

| Variable | Default | Description |
|---|---|---|
| `PORT` | `3000` | HTTP port the server listens on |
| `LOG_LEVEL` | `info` | Probot log level: `debug`, `info`, `warn`, `error` |
| `WEBHOOK_PROXY_URL` | — | [smee.io](https://smee.io) proxy URL for forwarding GitHub webhooks to localhost |

### Local development only

| Variable | Description |
|---|---|
| `LOCAL_DEV` | Set to `true` to skip Vault auth and env-service WebSocket. Uses a mock deploy instead. |

### E2E tests only

| Variable | Default | Description |
|---|---|---|
| `WEBHOOKS_PATH` | `/api/github/webhooks` | Webhook endpoint path |
| `GITHUB_OWNER` | `scalecube` | GitHub org used in test payloads |
| `GITHUB_REPO` | `robokit` | GitHub repo used in test payloads |
| `GITHUB_SHA` | `000...000` | Commit SHA used in test payloads |
| `GITHUB_INSTALLATION_ID` | `0` | App installation ID — required for real check run creation |

---

## Running locally

### 1. Create `.env`

```env
LOCAL_DEV=true

# GitHub App — required
APP_ID=
PRIVATE_KEY=-----BEGIN RSA PRIVATE KEY-----\n...\n-----END RSA PRIVATE KEY-----
WEBHOOK_SECRET=

# Server
PORT=7777
LOG_LEVEL=debug

# smee.io proxy — get a URL from https://smee.io/new
WEBHOOK_PROXY_URL=https://smee.io/your-channel

# Environment service
ENV_SERVICE_ADDRESS=wss://env-service.example.com
ENV_SERVICE_ROLE=your-oidc-role

# Vault — only needed when LOCAL_DEV is not set
VAULT_ADDR=
VAULT_SECRETS_PATH=
VAULT_ROLE=
VAULT_JWT_PROVIDER=
VAULT_JWT_PATH=

# E2E tests
GITHUB_OWNER=scalecube
GITHUB_REPO=robokit
GITHUB_SHA=
GITHUB_INSTALLATION_ID=
WEBHOOKS_PATH=/api/github/webhooks
```

### 2. Install dependencies

```bash
npm install
```

### 3. Start the server

```bash
npm run robokit
```

The server starts on `PORT` and listens for webhooks at `/api/github/webhooks`.

If `WEBHOOK_PROXY_URL` is set, Robokit connects to the smee.io channel and forwards all events from GitHub to your local server automatically — no tunnel required.

In `LOCAL_DEV` mode:
- Vault auth is skipped entirely
- The env-service WebSocket connection is skipped
- Deployments are simulated locally with a mock that progresses through `RUNNING → RUNNING → SUCCEEDED` over ~3 seconds, so you can observe the full GitHub check run status update flow without a real environment service

### 4. Watch mode (auto-restart on file change)

```bash
npm run dev
```

Uses nodemon; watches all source files and `.env`.

---

## Trigger conditions

Robokit triggers a deployment when **all** of the following are true:

| Condition | Value |
|---|---|
| GitHub event | `check_run` |
| `check_run.name` | `robokit-deploy` |
| `check_run.status` | `completed` |
| `check_run.conclusion` | `success` |
| Branch | `develop` or `master` |

Any other check run (different name, branch, status, or conclusion) is accepted by the webhook endpoint and returns `200`, but is silently ignored internally.

### Wiring the trigger in GitHub Actions

Add a job named `robokit-deploy` to your workflow that depends on your build/test jobs. GitHub will create a check run with that name when the job completes, which Robokit picks up:

```yaml
robokit-deploy:
  needs:
    - docker-build-push
    - helm-package-push
  runs-on: ubuntu-latest
  steps:
    - name: Trigger Robokit deploy
      run: echo "Deploy triggered"
```

The job itself does nothing — its completion is the signal.

### Manual actions

Once Robokit creates a "Robokit CD" check run, two buttons appear in the GitHub UI on that commit:

| Button | Effect |
|---|---|
| **Re-Deploy** | Immediately re-triggers the full deploy sequence |
| **Cancel-Deploy** | Cancels the running deployment |

---

## Running in production (Kubernetes)

No `.env` file is used in production. All secrets live in Vault.

**Startup sequence:**

1. Pod starts; Robokit reads the service account JWT from `VAULT_JWT_PATH`
2. Authenticates to Vault using the Kubernetes auth method (`VAULT_ROLE`, `VAULT_JWT_PROVIDER`)
3. Reads all secrets from `VAULT_SECRETS_PATH` and injects them into `process.env`
4. Connects to the environment service over WebSocket using a Vault-issued OIDC token
5. Starts the Probot HTTP server

The only variables that must be set in the pod spec (not Vault) are those needed to reach Vault itself:

```
VAULT_ADDR
VAULT_ROLE
VAULT_JWT_PROVIDER
VAULT_JWT_PATH
VAULT_SECRETS_PATH
```

---

## Testing

### Unit tests

```bash
npm test
```

Runs `test/unit/**` via Jest.

### E2E tests

Requires the server to be running first:

```bash
# Terminal 1
npm run robokit

# Terminal 2
npm run test:e2e
```

The e2e suite sends real signed HTTP requests to the running server and verifies:

- Server is reachable
- Webhooks with an invalid signature are rejected with HTTP `400`
- A valid `robokit-deploy` check run on `develop` is accepted (`200`/`202`)
- A check run with a different name is accepted but does nothing
- A check run on a feature branch is accepted but does nothing

All config is read from `.env` automatically — no hardcoded values in the test file.

### Manual webhook — PowerShell

`fakewebhook.ps1` sends a signed `check_run` webhook from the command line, simulating what GitHub sends after a CI job completes. It reads `WEBHOOK_SECRET` and `PORT` from `.ronen` (a local JSON secrets file, not committed to git).

```powershell
.\fakewebhook.ps1 `
  -Owner         scalecube `
  -Repo          my-service `
  -Branch        develop `
  -Sha           <commit-sha> `
  -InstallationId <installation-id>
```

| Parameter | Default | Description |
|---|---|---|
| `-Owner` | `scalecube` | GitHub organisation or user |
| `-Repo` | `robokit` | Repository name |
| `-Branch` | `develop` | Branch name — use `develop` or `master` to trigger a deploy |
| `-Sha` | _(required)_ | A real commit SHA in the target repo (`git rev-parse HEAD`) |
| `-InstallationId` | `0` | GitHub App installation ID — required for check run creation to succeed |

The installation ID can be found in GitHub under:
**Settings → Developer settings → GitHub Apps → [app] → Install App → gear icon → the URL contains the ID**

---

## npm scripts

| Script | Description |
|---|---|
| `npm run robokit` | Start the server (Vault auth in prod, `.env` in LOCAL\_DEV) |
| `npm run dev` | Start with nodemon — auto-restarts on file or `.env` changes |
| `npm run start` | Start via Probot CLI directly (no Vault auth) |
| `npm test` | Run unit tests |
| `npm run test:e2e` | Run e2e tests (server must already be running) |
| `npm run lint` | Lint and auto-fix with StandardJS |
