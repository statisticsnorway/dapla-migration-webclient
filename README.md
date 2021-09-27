# dapla-migration-webclient

[![Build Status](https://dev.azure.com/statisticsnorway/Dapla/_apis/build/status/statisticsnorway.dapla-migration-webclient?repoName=statisticsnorway%2Fdapla-migration-webclient&branchName=master)](https://dev.azure.com/statisticsnorway/Dapla/_build/latest?definitionId=221&repoName=statisticsnorway%2Fdapla-migration-webclient&branchName=master)

This application is built for in-house use in Statistics Norway and it aims to create a user interface on top of the
[dapla-migration-project](https://github.com/statisticsnorway/dapla-migration-project) using the REST API from
[dapla-migration-coordinator](https://github.com/statisticsnorway/dapla-migration-coordinator).

### Try this application locally

The first time you clone the repository, remember to run `yarn install`.

Run `yarn start` and navigate to `http://localhost:3000`.

`yarn test` runs all tests and `yarn coverage` calculates (rather unreliably) test coverage.

### Docker locally

* `yarn build`
* `docker build -t dapla-migration-webclient .`
* `docker run -p 8000:8180 dapla-migration-webclient:latest`
    * Alternatively with custom environment
      variables: `docker run -p 8000:8180 -e REACT_APP_API=http://localhost:20261 dapla-migration-webclient:latest`
* Navigate to `http://localhost:8000`

**Note** that this application
requires [dapla-migration-project](https://github.com/statisticsnorway/dapla-migration-project)
running locally to have any meaningful functionality.
