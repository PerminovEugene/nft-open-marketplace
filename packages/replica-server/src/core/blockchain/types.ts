export type Address = string;

export type ContractsDeployData = {
  contracts: {
    name: string;
    address: Address;
  }[];
};
