import * as functions from "firebase-functions";
import axios, { AxiosError } from "axios";
import sanityClient from "@sanity/client";
import groq from "groq";

interface InstagramSettings {
  clientId: string | null;
  clientSecret: string | null;
  redirectUrl: string | null;
}

interface InstagramShortLivedToken {
  access_token?: string;
  user_id?: string;
}

interface InstagramLongLivedToken {
  access_token: string;
  token_type: "bearer";
  expires_in: number;
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

      if (
        !process.env.SANITY_PROJECT_ID ||
        !process.env.SANITY_PROJECT_DATASET ||
        !process.env.SANITY_API_TOKEN
      ) {
        throw new Error("ENV has not been setup correctly");
      }

      const client = sanityClient({
        projectId: process.env.SANITY_PROJECT_ID,
        dataset: process.env.SANITY_PROJECT_DATESET,
        useCdn: true,
        token: process.env.SANITY_API_TOKEN,
      });

      const { clientSecret, clientId, redirectUrl } =
        await client.fetch<InstagramSettings>(query);

      const formData = new URLSearchParams();
      formData.set("client_id", clientId ?? "");
      formData.set("client_secret", clientSecret ?? "");
      formData.set("redirect_uri", redirectUrl ?? "");
      formData.set("grant_type", "authorization_code");
      formData.set("code", code as string);

      const { data: shortData } = await axios.post<InstagramShortLivedToken>(
        "https://api.instagram.com/oauth/access_token",
        formData
      );

      const { data } = await axios.get<InstagramLongLivedToken>(
        `https://graph.instagram.com/access_token?grant_type=ig_exchange_token&client_secret=${clientSecret}&access_token=${shortData.access_token}`
      );

      await client
        .patch("instagram.settings")
        .set({
          accessToken: data.access_token,
          userId: shortData.user_id,
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
