export const SubscriptionLedgerAbi = [
	{"type":"function","name":"isServiceActive","inputs":[{"name":"batch","type":"uint256","internalType":"uint256"},{"name":"serviceId","type":"uint8","internalType":"uint8"}],"outputs":[{"name":"","type":"bool","internalType":"bool"}],"stateMutability":"view"},
	{"type":"function","name":"isSubscribed","inputs":[{"name":"user","type":"address","internalType":"address"},{"name":"batch","type":"uint256","internalType":"uint256"},{"name":"serviceId","type":"uint8","internalType":"uint8"}],"outputs":[{"name":"","type":"bool","internalType":"bool"}],"stateMutability":"view"},
	{"type":"function","name":"isSubscribedWithCall","inputs":[{"name":"user","type":"address","internalType":"address"},{"name":"batch","type":"uint256","internalType":"uint256"},{"name":"serviceId","type":"uint8","internalType":"uint8"},{"name":"to","type":"address","internalType":"address"},{"name":"callData","type":"bytes","internalType":"bytes"}],"outputs":[{"name":"","type":"bytes","internalType":"bytes"}],"stateMutability":"payable"},
	{"type":"error","name":"ExternalRequestReverted","inputs":[]},{"type":"error","name":"InactiveService","inputs":[]},
	{"type":"error","name":"InvalidSubscriptions","inputs":[]},
	{"type":"error","name":"NonContractDestinationException","inputs":[{"name":"to","type":"address","internalType":"address"}]},
	{"type":"error","name":"NotSubscribed","inputs":[]},
	{"type":"error","name":"ZeroAddressException","inputs":[]}
] as const;