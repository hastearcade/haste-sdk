# Overview

This is a small example oclif cli application to show the Haste CLI authentication process. In the project directory, you can run:

```
npm i
cp ./src/commands/.env-example ./src/commands/.env
./bin/run login
```

This will kick off the CLI authentication process, which will open a browser window for the user. Once authenticated
the cli tool will notify the user that they are authenticated.
