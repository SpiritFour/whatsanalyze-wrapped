# WhatsAnalyze Wrapped

- End of Year! So much has happend
- Reveal insights & get statistics, while all data stays on your device.
- No chat data is sent to a server it runs only locally in your browser.

Based on the open-source tool whatsanalyze.com we present the new wrapped version for limited time or forever.

No data about your chat is transferred to any server at all.
![wrapped-readne.png](frontend/public/img/wrapped-readme.png)

## Encountered an issue?

Please report bugs in the github issues.

# Running whatsanalyze wrapped locally

## Build Setup
We use node 24

```bash
# install dependencies
$ pnpm install

# serve with hot reload at localhost:3000
$ pnpm dev

# build for production and launch server
$ pnpm build
$ pnpm start

# generate static project
$ pnpm generate

```

Deployments are automated via GitHub Actions:
- **PR Preview**: Opening a PR creates a Firebase Hosting preview URL
- **Dev**: Merging to `production` deploys to Firebase Hosting (dev environment)
- **Production**: Merging to `production` deploys to GitHub Pages

## running together with firebase functions
1. terminal:
```bash
cd functions
npm i
npm dev
```
2. terminal
```bash
cd frontend
pnpm dev_with_functions
```

### Testing the payment process
1. start functions in local mode (also with stripe forewarding to local)
1. start fe in local mode
1. click on create session on main screen
1. pay with email, 4242 4242 4242 4242 12/40 111
1. redirect to our page, should automatically pull session info also with email of customer
1. in the function terminal you should also find the call for the successfull subscription creation