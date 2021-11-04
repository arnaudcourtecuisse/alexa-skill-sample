/* eslint-disable no-console */

import express from 'express'
import request from 'superagent'

const doFetch = async (): Promise<string> =>
  new Promise(resolve =>
    setTimeout(() => {
      console.log('API: response generated')
      resolve('data')
    }, 2000 + Math.floor(2000 * Math.random()))
  )

const memcache: Record<string, string> = {}

const get = async (): Promise<string> => {
  const cache = memcache['/async']
  if (cache) {
    console.log('API: cache')
    return cache
  }
  console.log('API: fetch')
  const data = await doFetch()
  memcache['/async'] = data
  return data
}

export const app = express()
app.get('/async', async (req, res) => {
  const data = await get()
  console.log('API: response sent')
  res.status(200).send(data)
})

export const getProxy = async (timeout: number) =>
  new Promise((resolve, reject) => {
    let finished = false
    const req = request('http://localhost:5001/async')
    setTimeout(() => {
      if (!finished) {
        finished = true
        req.abort()
        console.log('PROXY: timeout')
        reject(new Error('timeout'))
      }
    }, timeout)
    req
      .then(data => {
        if (!finished) {
          finished = true
          console.log('PROXY: got response')
          resolve(data)
        }
      })
      .catch(err => {
        if (!finished) {
          finished = true
          console.log('PROXY: error', err)
          reject(err)
        }
      })
  })
