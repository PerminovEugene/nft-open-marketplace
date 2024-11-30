import { faker } from '@faker-js/faker';
import { Metadata } from '../entities/metadata.entity';
import {
  NftAttributeDto,
  NftMetadataDto,
} from '../services/replication/metadata.service';

export function generateAttribute(amount: number): NftAttributeDto[] {
  return Array.from({ length: amount }, () => ({
    TraitType: faker.hacker.noun(),
    Value: faker.hacker.adjective(),
  }));
}
type MetadataOverride = Omit<Partial<Metadata>, 'attributes'>;

export function generateMetadata(
  overrides: MetadataOverride = {},
  attributesAmount = 1,
): NftMetadataDto {
  return {
    attributes: generateAttribute(attributesAmount),
    name: overrides.name || faker.commerce.productName(),
    description: overrides.description || faker.lorem.paragraph(),
    image: overrides.image || faker.image.url(),
    youtube_url: overrides.youtubeUrl || faker.internet.url(),
    animation_url: overrides.animationUrl || faker.internet.url(),
    background_color:
      overrides.backgroundColor || faker.color.rgb({ prefix: '#' }),
    external_url: overrides.externalUrl || faker.internet.url(),
  };
}
