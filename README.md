# Dashboard for Packit

[dashboard.packit.dev](https://dashboard.packit.dev)

<img src="./files/logos/prod.png" alt="Packit logo" width="200"/>

Dashboard for [Packit Service](https://github.com/packit-service).

## Local Development

```bash
# install dependencies
:~/dashboard $ make install-dependencies
```

```bash
# this will start the flask development server
:~/dashboard $ make run-dev-flask
# in another terminal
:~/dashboard $ make run-dev-frontend

# use the frontend port (i.e 3000 by default) for development
# it will proxy non react requests to flask during dev
# read the Makefile for details
```

(you make have to use modify the make command if you want to run flask in a virtulenv instead of using `python3-flask` from the fedora repos.)

```bash
# to create a production build of react and/or any other javascript libs
:~/dashboard $ make transpile-prod
# now forget everything about npm, deploy flask the usual way
```

## More Info

If you'd like to know more about [packit](https://github.com/packit-service), please check:

- Our website: [packit.dev](https://packit.dev/)
- [Packit Service](https://github.com/packit-service/packit-service)
- [Packit](https://github.com/packit-service/packit)
