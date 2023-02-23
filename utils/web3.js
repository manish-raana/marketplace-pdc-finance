import axios from "axios";
import { ethers } from "ethers";

const PdcFactoryContractAbi = require("../abi/pdcfactory.json");
const provider = new ethers.providers.JsonRpcProvider(
  "https://rpc-mumbai.maticvigil.com/"
);

export const fetchTokenBalancesFromMoralis = (address, callback) => {
  var config = {
    method: "get",
    url: `https://deep-index.moralis.io/api/v2/${address}/erc20?chain=mumbai`,
    headers: {
      "X-API-Key":
        "PXkjLss3RlL4CquQtGeLKoG1fkrgpWxlQ7RIpYMyG8wZkAqM1KBXjNHWFceHfCHy",
      "Content-Type": "application/json",
    },
  };

  axios(config)
    .then(function (response) {
      console.log(response.data);
      if (response && response.data) {
        callback(response.data);
        //setTokenBalanceList(response.data);
      }
    })
    .catch(function (error) {
      console.log(error);
    });
};
export const fetchNftListFromMoralis = (address, callback) => {
  const options = {
    method: "GET",
    url: `https://deep-index.moralis.io/api/v2/${address}/nft`,
    params: { chain: "mumbai", format: "decimal", normalizeMetadata: "true" },
    headers: {
      accept: "application/json",
      "X-API-Key": process.env.NEXT_PUBLIC_MORALIS_API_KEY,
    },
  };

  axios
    .request(options)
    .then(function (response) {
      console.log("nft-result:  ", response.data);
      callback(response.data);
    })
    .catch(function (error) {
      console.error(error);
    });
};
export function formatDate(value) {
  if (!value) {
    return "";
  }
  const time = new Date(value);
  if (isNaN(time.valueOf())) {
    return "";
  }
  return time.toLocaleString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  });
}
export function parseUnits(value) {
  return ethers.utils.parseUnits(value.toString(), "ether");
}
export function ethToHex(value) {
  return ethers.utils.hexlify(value);
}
export function convertDate(date) {
  return new Date(date).toLocaleString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  });
}
export function isValidAddress(address) {
  return ethers.utils.isAddress(address);
}
export function formattedDate(value) {
  if (!value) {
    return "";
  }
  const time = new Date(Number(value * 1000));
  if (isNaN(time.valueOf())) {
    return "";
  }
  return time.toLocaleString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  });
}
export function hexToEth(value) {
  try {
    return ethers.utils.formatEther(value);
  } catch (error) {
    return error;
  }
}
export function hexToEth2(value) {
  try {
    return ethers.utils.formatEther(ethers.utils.toUtf8Bytes(value));
  } catch (error) {
    return error;
  }
}
export const IsPDCAvailable = async (address) => {
  try {
    const contract = new ethers.Contract(
      process.env.NEXT_PUBLIC_PDC_FACTORY_CONTRACT_ADDRESS,
      PdcFactoryContractAbi,
      provider
    );
    const data = await contract.pdcUserMapping(address);
    return data;
  } catch (error) {
    return error;
  }
};
module.exports = {
  fetchTokenBalancesFromMoralis: fetchTokenBalancesFromMoralis,
  fetchNftListFromMoralis: fetchNftListFromMoralis,
  convertDate: convertDate,
  formatDate: formatDate,
  isValidAddress: isValidAddress,
  IsPDCAvailable: IsPDCAvailable,
  hexToEth: hexToEth,
  parseUnits: parseUnits,
  formattedDate: formattedDate,
  ethToHex: ethToHex,
};
