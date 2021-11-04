import { getSlot } from 'ask-sdk-core'
import { RequestEnvelope } from 'ask-sdk-model'

export const getResolvedSlotValue = (
  requestEnvelope: RequestEnvelope,
  slotName: string
) => {
  const slot = getSlot(requestEnvelope, slotName)
  if (slot.resolutions?.resolutionsPerAuthority) {
    const resolution = slot.resolutions.resolutionsPerAuthority.find(
      r => r.status.code === 'ER_SUCCESS_MATCH'
    )
    if (resolution) {
      return resolution.values[0].value
    }
  }
  return null
}

export const getResolvedSlotValueId = (
  requestEnvelope: RequestEnvelope,
  slotName: string
) => {
  const value = getResolvedSlotValue(requestEnvelope, slotName)
  if (value !== null) {
    return value.id
  }
  return null
}
