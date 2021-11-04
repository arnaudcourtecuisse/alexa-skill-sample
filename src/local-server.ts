/* eslint-disable import/no-extraneous-dependencies, no-console */

/**

Run `node server` for a local handler.

To use this local server with an actual skill, you will need ngrok to open a HTTP tunnel.
Then, configure your skill to use the HTTPS endpoint provided by ngrok, using "subdomain with wildcard" certificate type.

 */

import 'dotenv/config'
import express from 'express'
// require your lambda
import skill from './skill'

const skillHandler = skill.create()
const PORT = process.env.PORT ?? 5000
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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
app.listen(PORT, () => console.log(`Listening on port ${PORT}`))
