'use server';

import { ApolloClient, ApolloError, gql, InMemoryCache } from '@apollo/client';
import { NFTInfo } from '~/domain/nft';

const stargaze = new ApolloClient({
  uri: 'https://graphql.mainnet.stargaze-apis.com/graphql',
  cache: new InMemoryCache(),
});

export async function fetchNFTInfoFromURL(url: string): Promise<NFTInfo> {
  const { host: rawHost, pathname } = new URL(url);
  const host = rawHost.replace('www.', '');

  switch (host) {
    case 'stargaze.zone':
      const [collectionAddr, tokenId] = pathname.split('/').slice(2);
      if (!collectionAddr || !tokenId) {
        throw new Error('Invalid stargaze URL');
      }
      try {
        const {
          data: {
            token: {
              collection: { name },
              traits,
              media: { url: imageUrl },
            },
          },
          error,
        } = await stargaze.query({
          query: gql`
              query Query {
                  token(collectionAddr: "${collectionAddr}", tokenId: "${tokenId}") {
                      collection {
                          name
                      }
                      traits {
                          name
                          value
                      }
                      media {
                          type
                          url
                      }
                  }
              }
          `,

          errorPolicy: 'all',
        });
        return { name, url, traits, imageUrl };
      } catch (err) {
        if (err instanceof ApolloError) {
          throw new Error(JSON.stringify(err.networkError));
        }
        throw err;
      }

    default:
      throw new Error(`Unsupported: ${host}`);
  }
}
