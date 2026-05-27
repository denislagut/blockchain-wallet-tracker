import { network } from "hardhat";
import { ethers } from "ethers";

const TOKEN_ADDRESS = "0x9EE4415b8a8F6d4004Ae9A618233fB941f812d62";
const TO_ADDRESS = "0x1F000ecd7264b261F573dB6685d21BF86153e526";

async function main() {
  const { ethers: hardhatEthers } = await network.connect();

  const token = await hardhatEthers.getContractAt(
    "MyToken",
    TOKEN_ADDRESS,
  );

  const amount = ethers.parseUnits("100", 18);

  const tx = await token.mint(TO_ADDRESS, amount);

  await tx.wait();

  console.log("Minted 100 MTK to:", TO_ADDRESS);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});