# Neil's Personal Website

![CI](https://github.com/ashfordneil/personal-website/workflows/CI/badge.svg)

This is meant to be a combined blog / portfolio / testing ground for new things
I want to build.

The site was kind-of bootstrapped with [create react
app](https://create-react-app.dev). In reality I made the project from scratch
and just borrowed the `react-scripts` package to do all of my building.
Functionally it's the same thing.

To see it in action, go [here](https://neilashford.dev).

## Development

Run `yarn start` to start up the dev builder + dev server. Then open up a
browser and navigate to [port 3000](http://localhost:3000). Everything should
handle itself from there.

For production builds, the `yarn build` command exists. To see how the site is
deployed check out [the GitHub Actions script](.github/workflows/main.yml).
