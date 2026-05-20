import { ethers } from "ethers";
import { env } from "../config/env.js";

export const provider = new ethers.JsonRpcProvider(env.sepoliaRpcUrl);