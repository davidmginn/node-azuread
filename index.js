const express = require("express");
const app = express();
const fetch = require("node-fetch");

const passport = require("passport");
const bearerStrategy = require("passport-azure-ad").BearerStrategy;

const port = process.env.PORT || 8080;

const tenantId = "7089525a-d323-4116-9835-16a42cc02cd0";
const clientId = "aeee2ec8-6ee9-4122-aeb7-ebeb08031dff";

const creds =  {
    clientID: clientId,
    identityMetadata: `https://login.microsoftonline.com/${tenantId}/.well-known/openid-configuration`,
    validateIssuer: true,
    loggingLevel: 'info',
    audience: 'https://davidmginnlive.onmicrosoft.com/69955e94-2ab2-4eff-902c-9279e632352f'
  }

var strategy = new bearerStrategy(creds,
    function(token, done) {
        console.log(token, 'was the token retreived');
        if (!token.oid)
            done(new Error('oid is not found in token'));
        else {
            owner = token.oid;
            done(null, token);
        }
    }
);

passport.use(strategy);

app.use(passport.initialize());
app.use(passport.session());

app.get("/", (req, res) => {
  fetch("https://dginn-iptest.azurewebsites.net/api/values")
    .then(res => res.json())
    .then(json => res.send(json));
});

app.get("/insecure", (req, res) => {
  return res.json({
    status: "success"
  });
});

app.get(
  "/secure",
   passport.authenticate("oauth-bearer", { session: false }),
  (req, res, next) => {
    return res.json({
      status: "success"
    });
  }
);

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
