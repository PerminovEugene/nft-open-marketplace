// export async function mintPnfts() {
//   const [deployer, receiver] = await ethers.getSigners();

//   console.log("Sending transaction from deployer to receiver...");

//   const CID = "QmRH3uGyLmRp9BziGBc1XMMLu8fjXuWe5jtpVCGR9CnVQK";

//   const tx = await deployer.sendTransaction({
//     to: receiver.address,
//     value: ethers.utils.parseEther("1.0"),
//   });

//   await tx.wait();

//   console.log(`Transaction hash: ${tx.hash}`);
// }

// main()
//   .then(() => process.exit(0))
//   .catch((error) => {
//     console.error(error);
//     process.exit(1);
//   });
