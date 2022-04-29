# esahime_project_name

![Logo](/public/logo.png)

An TypeScript Express template.

This template is designed for people

 - Who only want to use TypeScript.
 - Who don't give a sh1t about frontend toolchain.

## Features
 - Write both frontend and backend with TypeScript.
 - Hot reloading all the time.
 - No static file generation. You don't need to care about that.
 - Use SWC instead of TSC for faster building.

## Attention
 - This template is designed for building small projects / toys.
 - Not designed for CDN depolyment.
 - Cannot use `res.render` so far. HTMLs are handled by webpack.

## Commands
 - npm run dev
 - npm run prod

## Env

Make a `.env` file under root folder.

This would be like:

```
HOST=0.0.0.0
PORT=3000
APP_NAME=Express-Typescript
APP_AUTHOR=John Smith
```

You have to specific at least `HOST` and `PORT`.
