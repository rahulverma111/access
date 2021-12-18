module.exports = (app) => {
  app.get("/liveness", async (req, res) => {
    return res.code(200).send({ status: "Access service is alive" });
  });

  app.get("/readiness", async (req, res) => {
    return res.code(200).send({ status: "Access service is ready" });
  });

  return [
    {
      endpoints: [
        // Register
        ["post", "/register", "Users/CanRegister"],
        [
          "post",
          "/request-verify-registration",
          "Users/RequestVerifyRegistration",
        ],
        ["post", "/verify-registration", "Users/VerifyRegistration"],

        // Login
        ["post", "/login", "Users/CanLogin"],
        ["get", "/user", "Users/ViewLoggedInUser"],
        ["get", "/authorize", "Users/Authorize"],

        // Teams
        ["post", "/teams", "Teams/UserCanCreateTeam"],
        ["put", "/teams/:team_uuid", "Teams/UserCanUpdateTeam"],

        // Teams Tokens
        ["post", "/teams/:team_uuid/tokens", "Tokens/TeamAdminCanCreateToken"],
        ["get", "/teams/:team_uuid/tokens", "Tokens/TeamAdminCanGetTokens"],
        ["delete", "/teams/:team_uuid/tokens/:token_uuid", "Tokens/TeamAdminCanDeleteToken"],

        // Roles
        ["post", "/teams/:team_uuid/roles", "Roles/TeamAdminCanCreateRole"],
        ["get", "/roles/:team_uuid", "Roles/TeamAdminCanGetRoles"],
      ],
    },
  ];
};
