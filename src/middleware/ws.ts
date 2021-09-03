import { GRAPHQL_TRANSPORT_WS_PROTOCOL } from 'graphql-ws';
import type { IncomingMessage } from 'http';
import ws from 'isomorphic-ws';
import type { Duplex } from 'stream';
import { GRAPHQL_WS } from 'subscriptions-transport-ws';

export const routeGrapqhlWS: (subTransWs: ws.Server, graphqlWs: ws.Server) => (req: IncomingMessage, socket: Duplex, head: Buffer) => void = (subTransWs, graphqlWs) => {
  // extract websocket subprotocol from header
  return (req, socket, head) => {
    const protocol = req.headers['sec-websocket-protocol'];
    const protocols = Array.isArray(protocol) ? protocol : protocol?.split(',').map((p) => p.trim());

    // decide which websocket server to use
    const wss =
      protocols?.includes(GRAPHQL_WS) && // subscriptions-transport-ws subprotocol
      !protocols.includes(GRAPHQL_TRANSPORT_WS_PROTOCOL) // graphql-ws subprotocol
        ? subTransWs
        : // graphql-ws will welcome its own subprotocol and
          // gracefully reject invalid ones. if the client supports
          // both transports, graphql-ws will prevail
          graphqlWs;
    wss.handleUpgrade(req, socket as any, head, (wsocket) => {
      wss.emit('connection', wsocket, req);
    });
    // console.log('Server WS Route:', protocols?.includes(GRAPHQL_WS) && !protocols.includes(GRAPHQL_TRANSPORT_WS_PROTOCOL) ? 'SubscriptionServer' : 'graphQL-ws');
  };
};
