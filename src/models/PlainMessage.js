import KnishIOModel from 'src/models/KnishIOModel.js'
import { uid } from 'quasar'

export default class PlainMessage extends KnishIOModel {
  constructor (message, publisherId, receiverId) {
    super({})
    this.message = message
    this.publisherId = publisherId
    this.receiverId = receiverId
  }

  body () {
    this.uid = uid()
    return {
      metaData: {
        message: this.message,
        publisherId: this.publisherId,
        receiverId: this.receiverId
      },
      metaId: this.uid
    }
  }

  static generateQuery (publisherId, receiverId, metaId = null, latest = true) {
    return {
      metaType: KnishIOModel.resolveMetaType(this.metaType),
      metaId,
      latest,
      key: ['publisherId', 'receiverId', 'publisherId', 'receiverId'],
      value: [publisherId, receiverId, receiverId, publisherId]
    }
  }

  static convertToMessage (instance, myBundleId) {
    if (instance.metaType !== KnishIOModel.resolveMetaType(this.metaType)) {
      return null
    }
    const messageObj = new PlainMessage()
    messageObj.id = instance.metaId
    messageObj.createdAt = instance.createdAt
    messageObj.loadMetas(instance.metas)
    messageObj.message = messageObj.metas.message !== undefined ? messageObj.metas.message : null
    messageObj.publisherId = messageObj.metas.publisherId !== undefined ? messageObj.metas.publisherId : null
    messageObj.receiverId = messageObj.metas.receiverId !== undefined ? messageObj.metas.receiverId : null
    messageObj.isMine = myBundleId === messageObj.publisherId
    return messageObj
  }
}
PlainMessage.metaType = 'PlainMessage'
