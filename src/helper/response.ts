import { HandlerInput } from 'ask-sdk-core'

export const setPartialOutput = (
  handlerInput: HandlerInput,
  statement: string
) => {
  const attributes = handlerInput.attributesManager.getRequestAttributes()
  attributes.responseIntro = `${attributes.responseIntro || ''}${statement} `
  handlerInput.attributesManager.setRequestAttributes(attributes)
}

export const resetPartialOutput = (handlerInput: HandlerInput) => {
  const attributes = handlerInput.attributesManager.getRequestAttributes()
  delete attributes.responseIntro
  handlerInput.attributesManager.setRequestAttributes(attributes)
}

// For manual handling of the partial output
export const getPartialOutput = (handlerInput: HandlerInput) => {
  const { responseIntro = '' } =
    handlerInput.attributesManager.getRequestAttributes()
  return responseIntro
}

export const getOutputAndReprompt = (
  handlerInput: HandlerInput,
  statement: string | null,
  question?: string
) => {
  const { responseIntro } =
    handlerInput.attributesManager.getRequestAttributes()
  const output = `${responseIntro || ''}${statement || ''} ${question || ''}`
  return { output, reprompt: question }
}

export const buildSpeechResponse = (
  handlerInput: HandlerInput,
  statement: string | null,
  question?: string
) => {
  const { output, reprompt } = getOutputAndReprompt(
    handlerInput,
    statement,
    question
  )
  handlerInput.responseBuilder.speak(output)
  if (reprompt) {
    handlerInput.responseBuilder.reprompt(reprompt)
  } else {
    handlerInput.responseBuilder.withShouldEndSession(true)
  }
  return handlerInput.responseBuilder
}

export const getSpeechResponse = (
  handlerInput: HandlerInput,
  statement: string | null,
  question?: string
) => {
  return buildSpeechResponse(handlerInput, statement, question).getResponse()
}
