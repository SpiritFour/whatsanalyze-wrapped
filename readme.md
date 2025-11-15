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

Use `deploy.sh` to publish new version of the website

## running together with firebase functions
1. terminal:
```bash
cd functions
pnpm dev
```
2. terminal
```bash
cd frontend
pnpm dev_with_functions
```