module.exports = {
  apps: [
    {
      name: "tottech-one",
      script: "node_modules/next/dist/bin/next",
      args: "start -p 3000",
      cwd: "/opt/tottech-one-rebuild",
      instances: 1,
      exec_mode: "fork",
      env: {
        NODE_ENV: "production"
      }
    }
  ]
};
