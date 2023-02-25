import axios from "axios";
import { ethers } from "ethers";

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
module.exports = {
  convertDate: convertDate,
  formatDate: formatDate,
  isValidAddress: isValidAddress,
  hexToEth: hexToEth,
  parseUnits: parseUnits,
  formattedDate: formattedDate,
  ethToHex: ethToHex,
};
