import { successAlert, errorAlert } from "./alerts";
const tokenAddress = process.env.NEXT_PUBLIC_TOKEN_FAUCET_ADDRESS;
const tokenSymbol = "tUSDC";
const tokenDecimals = 18;
const tokenImage = "";

export async function addTokenFunction() {
  try {
    const wasAdded = await ethereum.request({
      method: "wallet_watchAsset",
      params: {
        type: "ERC20",
        options: {
          address: tokenAddress,
          symbol: tokenSymbol,
          decimals: tokenDecimals,
          image: tokenImage,
        },
      },
    });

    if (wasAdded) {
      successAlert("Token is added successfully!");
    } else {
      errorAlert("Token is not added! Please try again later!");
    }
  } catch (error) {
    console.log(error);
  }
}
