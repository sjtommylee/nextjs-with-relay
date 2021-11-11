import 'regenerator-runtime/runtime';
import { Store, RecordSource, Environment } from 'relay-runtime';
import { RelayNetworkLayer, urlMiddleware, authMiddleware } from 'react-relay-network-modern';
import RelayServerSSR from 'react-relay-network-modern-ssr/lib/server';

// the initial environment we are creating.
export function createEnvironment(relaySSR: RelayServerSSR) {
  const config = {
    url: `${process.env.BACKEND_URL}` || 'https://localhost:1337/graphql'
  };
  const network = new RelayNetworkLayer([relaySSR.getMiddleware(), urlMiddleware({ ...config })]);

  return new Environment({
    network,
    store: new Store(new RecordSource())
  });
}
