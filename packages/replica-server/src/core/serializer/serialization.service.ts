import { Injectable } from '@nestjs/common';

@Injectable()
export class SerializationService {
  public serialize = (obj: any) => {
    return JSON.stringify(
      obj,
      (_, value) =>
        typeof value === 'bigint' ? value.toString() + 'n' : value, // Add "n" to signify BigInt
    );
  };

  public deserialize = (str: string) => {
    return JSON.parse(str, (_, value) => {
      if (typeof value === 'string' && value.endsWith('n')) {
        return BigInt(value.slice(0, -1)); // Convert "123n" back to BigInt
      }
      return value;
    });
  };
}
