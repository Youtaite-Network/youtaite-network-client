# Youtaite Network

[Check out the deployed website here](https://youtaite-network.netlify.app).

## Summary

This project is focused on the youtaite community, a group of Youtube content creators who often collaborate with each other. We use a network data visualization to show how different collaborations are connected to each other through people - for example, if you are in two different collabs, those two collabs are connected through you. We hope to show the existence of different subgroups within the community, where people collaborate with each other more often than with someone outside of their subgroup. The frontend website is written in React. The data visualization is created using d3. The backend API is written in Ruby on Rails.

## Technical Description

See the [GitHub pages website](https://youtaite-network.github.io/youtaite-network-client) for a detailed technical description.

## Initial setup

* Clone the GitHub repository: `git clone git@github.com:Youtaite-Network/youtaite-network-client.git`
 * You may have to [set up a GitHub SSH key](https://docs.github.com/en/authentication/connecting-to-github-with-ssh).
* [Install yarn](https://classic.yarnpkg.com/en/docs/install) if you don't have it.
* Go into the repository directory: `cd youtaite-network-client`
* Install dependencies: `yarn install`
* Copy `.env.local.example` to `.env.local`: `cp .env.local.example .env.local`
* Replace REACT_APP_GOOGLE_CLIENT_ID with a Google client ID. (todo: instructions on how to create it)
* If you want it to run on a different port, edit the PORT variable in .env
 * Make sure the "Authorized JavaScript origins" for the Google client ID uses the specified port
* Start the server by running `yarn start`

## Run and Build

To run the app in development mode, run `yarn start`.

To build the app for production, run `yarn build`.

## License
This project is licensed under the terms of the MIT license.
