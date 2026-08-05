// @ts-nocheck
import md5 from 'md5';

export class MessageHandler {
  constructor() {
    this.messages = [];
    this.currentMessage = null;
    this.pinnedMessages = new Set(
      JSON.parse(localStorage.getItem('pinnedMessages') || '[]')
    );
  }

  addMessage(msgInfo, fileName) {
    // Generate hash from message properties
    const hashInput = `${msgInfo.senderEmail}-${msgInfo.messageDeliveryTime}-${msgInfo.subject}-${fileName}`;
    const hash = md5(hashInput);

    // Robust date parsing: try multiple fields
    const dateFields = [
      msgInfo.messageDeliveryTime,
      msgInfo.clientSubmitTime,
      msgInfo.creationTime,
      msgInfo.lastModificationTime,
    ];
    let parsedDate = null;
    for (const val of dateFields) {
      if (val) {
        const d = new Date(val);
        if (!isNaN(d.getTime())) {
          parsedDate = d;
          break;
        }
      }
    }

    // Add message to list
    const message = {
      ...msgInfo,
      fileName,
      messageHash: hash,
      timestamp: parsedDate,
    };

    this.messages.unshift(message);
    this.sortMessages();
    return message;
  }

  sortMessages() {
    this.messages.sort((a, b) => b.timestamp - a.timestamp);
  }

  setCurrentMessage(message) {
    this.currentMessage = message;
  }
}
