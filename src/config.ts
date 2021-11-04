const isUndefined = (val: string | undefined): val is undefined =>
  typeof val === 'undefined'

if (isUndefined(process.env.ALEXA_SKILL_ID)) {
  throw new Error('ALEXA_SKILL_ID is undefined')
}
export const skillId = process.env.ALEXA_SKILL_ID

if (isUndefined(process.env.DYNAMO_DB_TABLE)) {
  throw new Error('DYNAMO_DB_TABLE is undefined')
}
export const dynamoDbTable = process.env.DYNAMO_DB_TABLE
