import { LambdaHandler } from 'ask-sdk-core'
import 'source-map-support/register'
import skill from './skill'

const customHandlerFactory = (): LambdaHandler => {
  const skillHandler = skill.lambda()

  return (event, context, callback) => {
    skillHandler(event, context, (error, response) => {
      callback(error, response)
    })
  }
}

// eslint-disable-next-line import/prefer-default-export
export const handler = customHandlerFactory()
