/* eslint-disable import/no-extraneous-dependencies, no-console */

/**

Run `node server` for a local handler.

To use this local server with an actual skill, you will need ngrok to open a HTTP tunnel.
Then, configure your skill to use the HTTPS endpoint provided by ngrok, using "subdomain with wildcard" certificate type.

 */
import 'source-map-support'
import 'dotenv/config'
import express from 'express'
import { app as asyncApp } from './async'
// require your lambda
import skill from './skill'

const skillHandler = skill.create()
const app = express()

app.post('/', express.json(), async (req, res) => {
  try {
    const response = await skillHandler.invoke(req.body)
    res.json(response)
  } catch (err) {
    console.log(err)
    res
      .status(500)
      .json({ error: err instanceof Error ? err.message : 'Server error' })
  }
})

const PORT = process.env.PORT ? Number(process.env.PORT) : 5000
app.listen(PORT, () => console.log(`Listening on port ${PORT}`))

const REPORT = PORT + 1
asyncApp.listen(REPORT, () => console.log(`Listening on port ${REPORT}`))
