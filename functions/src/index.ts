import * as functions from 'firebase-functions'
import { createAndSaveLongLifeInstagramToken } from 'sanity-plugin-instagram'

export const loginToInstagram = functions.https.onRequest(
  async (req, response) => {
    try {
      const { code } = req.query

      await createAndSaveLongLifeInstagramToken(
        code as string,
        {
          projectId: process.env.SANITY_PROJECT_ID,
          dataset: process.env.SANITY_PROJECT_DATESET,
          apiToken: process.env.SANITY_API_TOKEN,
        },
        true
      )

      response.redirect('http://localhost:3333/instagram')

      return
    } catch (err) {
      functions.logger.log(err)
      response.json({
        access_token: null,
        err,
      })
      return
    }
  }
)
