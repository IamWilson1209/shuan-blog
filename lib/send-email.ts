import { handleSendMail } from './mail-service';


async function testSendMail() {
  try {
    console.log('Sending mail...');
    const sendResult = await handleSendMail('zenfonlee@gmail.com', 'Send Mail Test', '嗨');
    console.log('OK:', sendResult);
  } catch (error) {
    console.error('Fail:', error instanceof Error ? error.message : error);
  }
}

// 執行測試
testSendMail();