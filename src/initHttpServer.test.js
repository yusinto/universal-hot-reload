jest.mock('./index', () => ({on: global.td.function('httpServer.on')}));

import td from 'testdouble';
import mockHttpServer from './index';

let mockSocket1;
let mockSocket2;
let onSocket1Close;
let onConnectionHandler;
let initHttpServer;

describe('initHttpServer', () => {
  beforeEach(() => {
    mockSocket1 = {
      on: td.function('socket1.on'),
    };
    td.when(mockSocket1.on('close', td.matchers.isA(Function))).thenDo((s, f) => onSocket1Close = f);

    mockSocket2 = {
      on: td.function('socket2.on'),
    };
    td.when(mockHttpServer.on('connection', td.matchers.isA(Function))).thenDo((s, f) => onConnectionHandler = f);

    initHttpServer = require('./initHttpServer').default;
  });

  afterEach(() => {
    td.reset();
  });

  test('should return an object containing http.Server and a map of socket references', () => {
    const result = initHttpServer('./index');

    expect(result.httpServer).toEqual(mockHttpServer);
    expect(result.sockets).not.toBeNull();
  });

  it('should add socket references on connection', () => {
    const result = initHttpServer('./index');
    onConnectionHandler(mockSocket1);
    onConnectionHandler(mockSocket2);
    console.log(`sockets0 = ${JSON.stringify(result.sockets.get(0))}`);
    expect(result.sockets.has(0)).toBeTruthy();
    expect(result.sockets.get(0)).toEqual(mockSocket1);
    expect(result.sockets.has(1)).toBeTruthy();
    expect(result.sockets.get(1)).toEqual(mockSocket2);
    td.verify(mockSocket1.on('close', td.matchers.isA(Function)));
    td.verify(mockSocket2.on('close', td.matchers.isA(Function)));
  });

  it('should remove socket references on close', () => {
    const result = initHttpServer('./index');
    onConnectionHandler(mockSocket1);
    onConnectionHandler(mockSocket2);
    onSocket1Close();

    expect(result.sockets.has(0)).toBeFalsy();
    expect(result.sockets.has(1)).toBeTruthy();
    expect(result.sockets.get(1)).toEqual(mockSocket2);
    expect(result.sockets.size).toEqual(1);
  });
});