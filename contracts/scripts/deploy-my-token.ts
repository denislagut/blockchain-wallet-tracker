import { network } from "hardhat";

async function main() {
  const { ethers } =
    await network.connect();

  const MyToken =
    await ethers.getContractFactory(
      "MyToken",
    );

  const token =
    await MyToken.deploy();

  await token.waitForDeployment();

  console.log(
    "MyToken deployed:",
    await token.getAddress(),
  );
}

main().catch((error) => {
  console.error(error);

  process.exitCode = 1;
});