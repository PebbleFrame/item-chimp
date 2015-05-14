[![Stories in Ready](https://badge.waffle.io/family-thief/pebbleframe.svg?label=ready&title=Ready)](http://waffle.io/family-thief/pebbleframe)

# ItemChimp

> A Data Visualization Tool for Shoppers

## Team

### Original Team
  - __Product Owner__: Chistina Holland
  - __Scrum Master__: Michael Cheng
  - __Development Team Members__: Jeff Peoples, Vinaya Gopisetti

### Legacy Team
  - __Scrum Master__: Craig Smith
  - __Development Team Members__: Adam Van Antwerp, Henry Ng, Brandon Ellis

## Table of Contents

1. [Usage](#Usage)
1. [Requirements](#requirements)
1. [Development](#development)
    1. [Installing Dependencies](#installing-dependencies)
    1. [Tasks](#tasks)
1. [Team](#team)
1. [Contributing](#contributing)

## Usage

> This app is built with React.js on the front-end and Node.js/Express on the back-end. There are several major parts of this app:

1. Front-end: React.js - React allows each part of the UI to be broken into modular components. These components can be inserted into other components easily to maintain an organized separation of concerns. The various components for the React front-end are found in the `client` folder.

1. Back-end: Node.js/Express Framework - The Express framework provides middleware to make working with Node much simpler.

1. Database: MySql (Bookshelf ORM) - MySql, a relational database, is used to store user and review data. The schema and models for our MySql database can be found in `server/db`. 

1. APIs: The two primary APIs used in this app are the Walmart and Best Buy APIs. The Amazon API is also incorporated into this app, but unfortunately, Amazon does not return reviews directly, so we cannot utilize its review data for our D3 visualization.

1. D3 - D3 is used to visualize the data retrieved from API requests.

1. Browserify - Browserify is used to allow the `require` statement to be used on browser code. It recursively analyzes all the `require` calls in the app and builds a bundle that is served up to the browser in a single `<script>` tag. It is standard practice to use something like Browserify (or Webpack) with React.js.

1. Grunt - Grunt is used to run the server (`nodemon`) and `browserify` at the same time, so that whenever a React file is changed, browserify will automatically compile it. Therefore, use `grunt serve` for development.

## Requirements

- Node 0.10.x
- MySql

## Development

### Installing Dependencies

From within the root directory:

```sh
sudo npm install -g bower
npm install
bower install
```

To set up the MySql database:

```
mysql.server start
mysql -u root < server/db/schema.sql
```

Then, rename server/db/config.json.example to config.json.  By default, it will point to the local database.  If you want to use a remote database, simply change the values in the config to point to your prefered server.

`schema.sql` will build the necessary database for the app.

![schema](http://i.imgur.com/7W7Uy9U.png "Schema")


### Getting started

To start the app, simply use

`grunt serve`

from the root directory.

### Roadmap

View the project roadmap [here](https://waffle.io/family-thief/pebbleframe)


## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for contribution guidelines.
