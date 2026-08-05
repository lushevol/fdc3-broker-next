// @ts-nocheck
import MsgReaderLib from '@kenjiuno/msgreader';
import { decompressRTF } from '@kenjiuno/decompressrtf';
import rtfStreamParser from 'rtf-stream-parser';
import iconvLite from 'iconv-lite';


export function extractMsg(fileBuffer) {
  let msgInfo = null;
  let msgReader = null;
  try {
    // Check if MsgReader exists as a function/constructor
    if (typeof MsgReaderLib === 'function') {
      msgReader = new MsgReaderLib(fileBuffer);
      msgInfo = msgReader.getFileData();
    } else if (MsgReaderLib && typeof MsgReaderLib.default === 'function') {
      msgReader = new MsgReaderLib.default(fileBuffer);
      msgInfo = msgReader.getFileData();
    } else {
      // console.error('MsgReader constructor could not be found.');
    }
  } catch (error) {
    // console.error('Error creating a MsgReader instance:', error);
  }

  const emailBodyContent = msgInfo && (msgInfo.bodyHTML || msgInfo.body);
  let emailBodyContentHTML = '';

  if (msgInfo && msgInfo.compressedRtf) {
    try {
      const decompressedRtf = decompressRTF(
        Uint8Array.from(Object.values(msgInfo.compressedRtf))
      );
      emailBodyContentHTML = convertRTFToHTML(decompressedRtf);
    } catch (err) {
      // console.error('Failed to decompress or convert RTF:', err);
      emailBodyContentHTML = emailBodyContent || '';
    }
  } else if (msgInfo && msgInfo.html && typeof msgInfo.html === 'object') {
    // Try to decode HTML from Uint8Array
    try {
      let htmlArr;
      if (Array.isArray(msgInfo.html)) {
        htmlArr = Uint8Array.from(msgInfo.html);
      } else {
        // msgInfo.html is likely an object with numeric keys
        htmlArr = Uint8Array.from(Object.values(msgInfo.html));
      }
      // Try TextDecoder first, fallback to Buffer
      let htmlStr = '';
      if (typeof TextDecoder !== 'undefined') {
        htmlStr = new TextDecoder('utf-8').decode(htmlArr);
      } else {
        htmlStr = Buffer.from(htmlArr).toString('utf-8');
      }
      emailBodyContentHTML = htmlStr;
    } catch (err) {
      console.log('Failed to decode HTML from Uint8Array:', err);
      emailBodyContentHTML = emailBodyContent || '';
    }
  } else {
    console.log('Missing compressedRtf in msgInfo:', msgInfo);
    emailBodyContentHTML = emailBodyContent || '';
  }

  // Extract images and attachments
  if (msgInfo.attachments && msgInfo.attachments.length > 0) {
    msgInfo.attachments.forEach((attachment, index) => {
      const contentUint8Array = msgReader.getAttachment(attachment).content;
      const contentBuffer = Buffer.from(contentUint8Array);
      const contentBase64 = contentBuffer.toString('base64');

      const base64String = `data:${attachment.attachMimeTag};base64,${contentBase64}`;

      if (
        attachment.attachMimeTag &&
        attachment.attachMimeTag.startsWith('image/')
      ) {
        emailBodyContentHTML = emailBodyContentHTML.replaceAll(
          `cid:${attachment.pidContentId}`,
          base64String
        );
      } else {
        emailBodyContentHTML = emailBodyContentHTML.replace(
          `href="cid:${attachment.pidContentId}"`,
          `href="${base64String}"`
        );
      }

      msgInfo.attachments[index].contentBase64 = base64String;
    });
  }

  return msgInfo
    ? {
        ...msgInfo,
        bodyContent: emailBodyContent,
        bodyContentHTML: emailBodyContentHTML,
      }
    : null;
}

// Function for converting the decompressed RTF content to HTML
function convertRTFToHTML(rtfContent) {
  const result = rtfStreamParser.deEncapsulateSync(rtfContent, {
    decode: iconvLite.decode,
  });
  return result.text;
}
