/* eslint-disable no-console */

import {
  DefaultApiClient,
  getIntentName,
  getRequestType,
  getUserId,
  RequestInterceptor,
  ResponseInterceptor,
  SkillBuilders,
} from 'ask-sdk-core'
import { CustomSkillErrorHandler } from 'ask-sdk-core/dist/dispatcher/error/handler/CustomSkillErrorHandler'
import { CustomSkillRequestHandler } from 'ask-sdk-core/dist/dispatcher/request/handler/CustomSkillRequestHandler'
import { DynamoDbPersistenceAdapter } from 'ask-sdk-dynamodb-persistence-adapter'
import { dynamoDbTable, skillId } from './config'
import { getSpeechResponse } from './helper/response'

const dynamoDbPersistenceAdapter = new DynamoDbPersistenceAdapter({
  tableName: dynamoDbTable,
  createTable: true,
  partitionKeyGenerator: getUserId,
})

const RequestLogger: RequestInterceptor = {
  process(input) {
    console.log('request:', input.requestEnvelope.request)
  },
}

const ResponseLogger: ResponseInterceptor = {
  process(input) {
    console.log('response:', input.responseBuilder.getResponse())
  },
}

const LaunchRequestHandler: CustomSkillRequestHandler = {
  canHandle(input) {
    return getRequestType(input.requestEnvelope) === 'LaunchRequest'
  },
  handle(input) {
    return getSpeechResponse(input, null, 'pong pong')
  },
}

const SessionEndHandler: CustomSkillRequestHandler = {
  canHandle(input) {
    return getRequestType(input.requestEnvelope) === 'SessionEndedRequest'
  },
  handle() {
    return {}
  },
}

const PingIntentHandler: CustomSkillRequestHandler = {
  canHandle(input) {
    return getIntentName(input.requestEnvelope) === 'PingIntent'
  },
  handle(input) {
    return getSpeechResponse(input, null, 'pong')
  },
}

const PongIntentHandler: CustomSkillRequestHandler = {
  canHandle(input) {
    return getIntentName(input.requestEnvelope) === 'PongIntent'
  },
  handle(input) {
    return getSpeechResponse(input, null, 'ping')
  },
}

const FallbackHandler: CustomSkillRequestHandler = {
  canHandle() {
    return true
  },
  handle(input) {
    return getSpeechResponse(input, null, 'smash')
  },
}

const ErrorHandler: CustomSkillErrorHandler = {
  canHandle() {
    return true
  },
  handle({ responseBuilder }, error) {
    return responseBuilder
      .speak(error.message)
      .reprompt(error.message)
      .getResponse()
  },
}

// Y/N handlers must be declared before the fallback FallbackYesIntentHandler and FallbackNoIntentHandler
export default SkillBuilders.custom()
  .addRequestInterceptors(RequestLogger)
  .addResponseInterceptors(ResponseLogger)
  .addRequestHandlers(
    LaunchRequestHandler,
    PingIntentHandler,
    PongIntentHandler,
    SessionEndHandler,
    FallbackHandler
  )
  .addErrorHandlers(ErrorHandler)
  .withPersistenceAdapter(dynamoDbPersistenceAdapter)
  .withSkillId(skillId)
  .withApiClient(new DefaultApiClient())
