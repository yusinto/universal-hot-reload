import proxyquire from 'proxyquire';
import td from 'testdouble';

let mockSocket1;
let mockSocket2;
let onSocket1Close;
let onSocket2Close;
let onConnectionHandler;
let initHttpServer;
let mockHttpServer;

describe('initHttpServer', () => {
  beforeEach(() => {
    mockSocket1 = td.object('socket1');
    mockSocket1.on = td.function('socket1.on');
    td.when(mockSocket1.on('close', td.matchers.isA(Function))).thenDo((s, f) => onSocket1Close = f);

    mockSocket2 = td.object('socket2');
    mockSocket2.on = td.function('socket2.on');
    td.when(mockSocket2.on('close', td.matchers.isA(Function))).thenDo((s, f) => onSocket2Close = f);

    mockHttpServer = td.object('http.Server');
    mockHttpServer.on = td.function('http.Server.on');
    td.when(mockHttpServer.on('connection', td.matchers.isA(Function))).thenDo((s, f) => onConnectionHandler = f);

    initHttpServer = proxyquire('../src/initHttpServer', {'../src/index': mockHttpServer}).default;
  });

  afterEach(() => {
    td.reset();
  });

  it('should return an object containing http.Server and a map of socket references', () => {
    const result = initHttpServer('../src/index');

    expect(result.httpServer).to.eql(mockHttpServer);
    expect(result.sockets).to.not.be.null;
  });

  it('should add socket references on connection', () => {
    const result = initHttpServer('../src/index');
    onConnectionHandler(mockSocket1);
    onConnectionHandler(mockSocket2);

    expect(result.sockets.has(0)).to.be.true;
    expect(result.sockets.get(0)).to.be.eql(mockSocket1);
    expect(result.sockets.has(1)).to.be.true;
    expect(result.sockets.get(1)).to.be.eql(mockSocket2);
    td.verify(mockSocket1.on('close', td.matchers.isA(Function)));
    td.verify(mockSocket2.on('close', td.matchers.isA(Function)));
  });

  it('should remove socket references on close', () => {
    const result = initHttpServer('../src/index');
    onConnectionHandler(mockSocket1);
    onConnectionHandler(mockSocket2);
    onSocket1Close();

    expect(result.sockets.has(0)).to.be.false;
    expect(result.sockets.has(1)).to.be.true;
    expect(result.sockets.get(1)).to.be.eql(mockSocket2);
    expect(result.sockets.size).to.eq(1);
  });
});