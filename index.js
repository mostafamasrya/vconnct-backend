const express = require("express");
const axios = require("axios");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
const port = process.env.PORT || 3001;

app.post("/api/keycloak-token", async (req, res) => {
  try {
    const { code } = req.body;

    // Make the request to Keycloak
    const keycloakUrl =
      "https://ssodev.dragonteam.dev/auth/realms/Variiance/protocol/openid-connect/token";
    const response = await axios.post(
      keycloakUrl,
      {
        client_id: "VLC",
        redirect_uri: "https://localhost:3000/assets/redirectPage.html",
        code: code,
        grant_type: "authorization_code",
      },
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    // Respond with the token data
    res.json(response.data);
  } catch (error) {
    if (error.response && error.response.data) {
      // If the error response contains data, return it
      return res.status(error.response.status).json(error.response.data);
    } else {
      // Otherwise, return a generic error message
      console.error("Error:", error.message);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }
});

app.post("/api/refresh-token", async (req, res) => {
  try {
    const { refresh_token } = req.body;
    const keycloakUrl =
      "https://ssodev.dragonteam.dev/auth/realms/Variiance/protocol/openid-connect/token";
    const response = await axios.post(
      keycloakUrl,
      {
        client_id: "VLC",
        grant_type: "refresh_token",
        refresh_token: refresh_token,
      },
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );
    res.json(response.data);
  } catch (error) {
    console.error("Error:", error.response.data);
    res.status(500).json({ error: "Failed to refresh token" });
  }
});

app.get("/", (req, res) => {
  res.send("Working...");
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
