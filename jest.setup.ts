import 'intersection-observer';
import { TextEncoder, TextDecoder } from 'util';
import 'whatwg-fetch';

// 全局註冊
global.fetch = fetch;
global.Request = Request;
global.Response = Response;

global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;