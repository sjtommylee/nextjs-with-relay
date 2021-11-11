import React from 'react';
import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { RelayEnvironmentProvider } from 'react-relay';
import { makeEnvironment } from '../lib/relay/makeEnvironment';
import { RecordMap } from 'relay-runtime/lib/store/RelayStoreTypes';

interface Props {
  records?: RecordMap;
}

function App({ Component, pageProps, records: r }: AppProps & Props) {
  const records: RecordMap = React.useMemo(() => {
    if (r) return r;
    if (typeof document !== 'undefined') {
      const data = document.getElementById('relay')?.innerHTML;
      if (data) {
        console.log(data);
        return JSON.parse(Buffer.from(data, 'base64').toString());
      }
    }
  }, []);
  return (
    <RelayEnvironmentProvider environment={makeEnvironment(records)}>
      <Component {...pageProps} />;
    </RelayEnvironmentProvider>
  );
}
export default App;
