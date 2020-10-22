# Argo Application

"Keep your content cancel-resistant."

Argo is a flat-file static-site blog authoring and building system. It presents
a browser interface for ease of use, and synchronizes with any hosting service
using Git or rsync.

Because Argo keeps all your content on your computer, no hosting service can
ever deprive you of your content by cancelling your account. The content you
create is always on your own computer. This makes Argo sites more resistant to
censorship. Further, because Argo is a flat-file static-site system, remote
hosting requirements are minimal. Only a web server and a syncing service are
needed.

This repository holds the desktop Electron application wrapper around the
[core PHP code](https://github.com/getargo/php).

## Mac Users

Download
[Argo](https://github.com/getargo/app/releases/download/1.0.0/Argo.app.zip)
from [releases](https://github.com/getargo/app/releases), and double-click to
run it.

You may find that OS X will not launch Argo, because it did not come from the
App Store. To get around this, open `System Preferences` -> `Security & Privacy`
-> `General`, and allow apps downloaded from `App Store and identified
developers`. Then try to launch Argo again.

Mac users may find that OS X will not launch Argo, because it is not from the
App Store. To get around this, open `System Preferences` -> `Security & Privacy`
-> `General`, and allow apps downloaded from `App Store and identified
developers`. Then try to launch Argo again.

## Linux Users

TBD.

## Developers

To install and run the Electron application:

```
% git clone git@github.com:getargo/app argo-app
% cd argo-app
% composer create-project --keep-vcs --prefer-source -s dev getargo/php
% npm install
% npm start
```

## Getting Started

Watch this 5-minute video: <https://vimeo.com/471028569>
