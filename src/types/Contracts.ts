import type { Address, SupportedChain } from "@/types"
import type { Chain } from "viem";

export type NetworkImageUrl = `src/assets/networks/${string}.png`

export type NetworkInfo = {
  chainId: SupportedChain,
  address: Address
}

export type ActiveChain = {
  chainId: SupportedChain,
  name: string,
  src: NetworkImageUrl,
  chain: Chain
}