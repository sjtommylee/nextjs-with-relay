import { Network, Store, RecordSource, Environment } from 'relay-runtime';
import { RecordMap } from 'relay-runtime/lib/store/RelayStoreTypes';
import { useFetch } from './useFetch';

export function makeEnvironment(records?: RecordMap) {
  return new Environment({
    network: Network.create(useFetch),
    store: new Store(new RecordSource(records))
  });
}
