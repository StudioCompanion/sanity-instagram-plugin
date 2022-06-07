import * as functions from "firebase-functions";
import axios, { AxiosError } from "axios";
import sanityClient from "@sanity/client";
import groq from "groq";

interface InstagramSettings {
  clientId: string | null;
  clientSecret: string | null;
  redirectUrl: string | null;
}

interface InstagramToken {
  access_token?: string;
  user_id?: string;
}

export const loginToInstagram = functions.https.onRequest(
  async (req, response) => {
    try {
      const { code } = req.query;

      const query = groq`
      *[_type == "instagram.settings"][0]{
        clientId,
        clientSecret,
        redirectUrl
      }
    `;

      const client = sanityClient({
        projectId: "ae1ddmef",
        dataset: "production",
        useCdn: true,
        token:
          "skinJZtBnPHkGLO6sHxYPomcHH7ofJsk9E8te5xgqy9RBJThBc8uewpDL7GhffCalmDxezHDODcSmtyIpoJrSqXIU6OWn60HfhmooJKSwdJYG5cYv1PhL6p2vsZJQCFc023ScSXvSlzkL6oJcM9dtJmJpxD9xWL4JaFEGjkmcIxVlJP9UJmY",
      });

      const { clientSecret, clientId, redirectUrl } =
        await client.fetch<InstagramSettings>(query);

      const formData = new URLSearchParams();
      formData.set("client_id", clientId ?? "");
      formData.set("client_secret", clientSecret ?? "");
      formData.set("redirect_uri", redirectUrl ?? "");
      formData.set("grant_type", "authorization_code");
      formData.set("code", code as string);

      const { data } = await axios.post<InstagramToken>(
        "https://api.instagram.com/oauth/access_token",
        formData
      );

      await client
        .patch("instagram.settings")
        .set({
          accessToken: data.access_token,
          userId: data.user_id,
        })
        .commit();

      response.redirect("http://localhost:3333/instagram");

      return;
    } catch (err) {
      functions.logger.error((err as AxiosError).response?.data);
      response.json({
        access_token: null,
        err,
      });
      return;
    }
  }
);
