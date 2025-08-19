trigger: "ci"

test:
  type: "smoke"
  runner: "playwright"

suite:
  name: "CI"
  base: "/home/bench/tests/CI/playwright"

grafana:
  url: "http://localhost:3000"
  admin:
    user: "admin"
    password: "admin"

pw:
  prepare: "yarn install; yarn playwright install"
  execute: "yarn run test"

log:
  level: DEBUG
