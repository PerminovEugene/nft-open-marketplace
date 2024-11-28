import { SetMetadata } from '@nestjs/common';

// All contract services should have RegisterContract() decorator

export const REGISTER_CONTRACT_KEY = 'register_contract_key';
export const RegisterContract = () => SetMetadata(REGISTER_CONTRACT_KEY, true);
