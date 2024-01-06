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

  if (host === 'opensea.io') {
    // e.g. https://opensea.io/assets/ethereum/0x8a90cab2b38dba80c64b7734e58ee1db38b8992e/2241
    const [chain, address, tokenId] = pathname.split('/').slice(2);
    if (!chain || !address || !tokenId) {
      throw new Error('Check that the link points to valid OpenSea NFT.');
    }
    const response = await fetch(`https://api.opensea.io/api/v2/chain/${chain}/contract/${address}/nfts/${tokenId}`, {
      headers: {
        'x-api-key': process.env.OPENSEA_API_KEY as string,
        accept: 'application/json',
      },
    });
    if (!response.ok) {
      let errorReason = '';
      try {
        const { errors } = await response.json();
        errorReason = (errors as string[]).join(', ');
      } catch (err) {
        // ignore
        errorReason = response.statusText;
      }
      throw new Error(errorReason);
    }
    const { nft } = await response.json();
    return {
      name: nft.name,
      url,
      traits: nft.traits.map(({ trait_type, value }: { trait_type: string; value: string }) => ({
        name: trait_type,
        value,
      })),
      imageUrl: nft.image_url,
    };
  }
  if (host === 'stargaze.zone') {
    const [collectionAddr, tokenId] = pathname.split('/').slice(2);
    if (!collectionAddr || !tokenId) {
      throw new Error('Check that the link points to valid Stargaze NFT.');
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
  }
  throw new Error(`Unsupported: ${host}`);
}
