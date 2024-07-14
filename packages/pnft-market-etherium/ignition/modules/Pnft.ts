import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const PnftModule = buildModule("PnftModule", (m) => {
  const pnft = m.contract("Pnft");

  return { pnft };
});

export default PnftModule;
