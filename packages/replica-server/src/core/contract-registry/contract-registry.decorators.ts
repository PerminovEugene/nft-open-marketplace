import { SetMetadata } from '@nestjs/common';

// replicacte

export const REGISTER_CONTRACT_KEY = 'register_contract_key';
export const RegisterContract = () => SetMetadata(REGISTER_CONTRACT_KEY, true);
