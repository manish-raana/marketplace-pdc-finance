export interface NFTModel {
  contract: {
    address: string;
    contractDeployer: string;
    deployedBlockNumber: number;
    name: string;
    openSea: {
      collectionName: string;
      description: string;
      discordUrl: string;
      externalLink: string;
      floorPrice: string | number;
      imageUrl: string;
      lastIngestedAt: Date;
      safelistRequestStatus: any;
      twitterUsername: string;
    };
    symbol: string;
    tokenType: string;
    totalSupply: string;
  };
  media: [
    {
      bytes: number;
      format: string;
      gateway: string;
      raw: string;
      thumbnail: string;
    }
  ];
  metaDataError: any;
  rawMetadata: {
    attributes: Array<any>;
    description: string;
    image: string;
    name: string;
  };
  spanInfo: any;
  timeLastUpdated: any;
  title: string;
  tokenId: string;
  tokenUri: {
    gateway: string;
    raw: string;
  };
}
