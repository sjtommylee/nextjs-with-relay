/* eslint-disable react/display-name */
import Document, {
  Html,
  Head,
  Main,
  NextScript,
  DocumentContext,
  DocumentInitialProps
} from 'next/document';
import { RelayEnvironmentProvider } from 'relay-hooks';
import { createEnvironment } from '../lib/relay/createEnvironment';
import RelayServerSSR from 'react-relay-network-modern-ssr/lib/server';
import { RecordMap } from 'relay-runtime/lib/store/RelayStoreTypes';
import { makeEnvironment } from '../lib/relay/makeEnvironment';

interface Props {
  records: RecordMap;
}

class MyDocument extends Document<Props> {
  static async getInitialProps(ctx: DocumentContext): Promise<DocumentInitialProps & Props> {
    const originalRenderPage = ctx.renderPage;
    const relayServerSSR = new RelayServerSSR();
    const env = createEnvironment(relayServerSSR);

    ctx.renderPage = () =>
      originalRenderPage({
        // eslint-disable-next-line react/display-name
        enhanceComponent: Component => props => {
          return (
            <RelayEnvironmentProvider environment={env}>
              <Component {...props} />
            </RelayEnvironmentProvider>
          );
        }
      });

    // Run the parent `getInitialProps`, it now includes the custom `renderPage`
    await Document.getInitialProps(ctx);
    await relayServerSSR.getCache();
    const records = env.getStore().getSource().toJSON();

    ctx.renderPage = () =>
      originalRenderPage({
        enhanceApp: App => props => {
          return (
            <App
              {...props}
              // @ts-expect-error
              records={records}
            />
          );
        }
      });

    const initialProps = await Document.getInitialProps(ctx);
    return { ...initialProps, records };
  }

  render() {
    return (
      <Html>
        <Head />
        <body>
          <template id="relay-data">
            {Buffer.from(JSON.stringify(this.props.records)).toString('base64')}
          </template>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
