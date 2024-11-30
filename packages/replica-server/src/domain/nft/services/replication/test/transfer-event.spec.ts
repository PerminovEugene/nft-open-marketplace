import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Token } from '../../../../../domain/nft/entities/token.entity';
import { TransferEventEntity } from '../../../../../domain/nft/entities/transfer-event.entity';
import { MetadataService } from '../../../../../domain/nft/services/replication/metadata.service';
import { TransferEventReplicationService } from '../../../../../domain/nft/services/replication/transfer-event.service';
import { GenericContainer } from 'testcontainers';
import { DataSource } from 'typeorm';
import { Metadata } from '../../../entities/metadata.entity';
import { Attribute } from '../../../entities/attribute.entity';
import { Transaction } from '../../../../transaction/transaction.entity';
import { Listing } from '../../../../marketplace/entities/listing.entity';
import { NftListedEventEntity } from '../../../../marketplace/entities/nft-listed-event.entity';
import { NftPurchasedEventEntity } from '../../../../marketplace/entities/nft-purchases-event.entity';
import { generateTransferEventArgs } from '../../../test/transfer-event.factory';
import { generateTxData } from '../../../../transaction/test/transaction.factory';
import { generateMetadata } from '../../../test/metadata.factory';

describe('TransferEventReplicationService', () => {
  let service: TransferEventReplicationService;
  let dataSource: DataSource;
  let metadataService: MetadataService;
  let container;
  let metadata = generateMetadata({}, 3);

  beforeAll(async () => {
    // Start PostgreSQL Docker container
    console.log('generate container');
    container = await new GenericContainer('postgres')
      .withExposedPorts(5432)
      .withEnvironment({
        POSTGRES_USER: 'test',
        POSTGRES_PASSWORD: 'test',
        POSTGRES_DB: 'testdb',
      })
      .withStartupTimeout(120000)
      .start();

    const databasePort = container.getMappedPort(5432);
    const databaseHost = container.getHost();

    // Create testing module
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'postgres',
          host: databaseHost,
          port: databasePort,
          username: 'test',
          password: 'test',
          database: 'testdb',
          entities: [
            Token,
            Metadata,
            Attribute,
            Listing,
            TransferEventEntity,
            Transaction,
            NftListedEventEntity,
            NftPurchasedEventEntity,
          ],
          synchronize: true, // Automatically sync database schema for testing
        }),
        TypeOrmModule.forFeature([
          Token,
          Metadata,
          Attribute,
          TransferEventEntity,
          Transaction,
        ]),
      ],
      providers: [
        TransferEventReplicationService,
        {
          provide: MetadataService,
          useValue: {
            getMetadata: jest.fn((tokenId: string) => metadata),
          },
        },
      ],
    }).compile();

    service = module.get<TransferEventReplicationService>(
      TransferEventReplicationService,
    );
    dataSource = module.get<DataSource>(DataSource);
    metadataService = module.get<MetadataService>(MetadataService);
  }, 10000);

  afterAll(async () => {
    await dataSource.destroy();
    await container.stop();
  });

  it('should save a transfer event correctly', async () => {
    const transferEventArgs = generateTransferEventArgs();
    const [from, to, tokenIdBigInt] = transferEventArgs;
    const tokenId = tokenIdBigInt.toString();

    const txData = generateTxData();

    await service.save(transferEventArgs, txData);

    const tokenRepository = dataSource.getRepository(Token);
    const token = await tokenRepository.findOne({
      where: { contractId: tokenId },
      relations: ['metadata', 'metadata.attributes'],
    });
    expect(token).toBeDefined();
    expect(token.owner).toBe(to);

    expect(token.metadata.name).toBe(metadata.name);
    expect(token.metadata.description).toBe(metadata.description);
    expect(token.metadata.image).toBe(metadata.image);
    expect(token.metadata.externalUrl).toBe(metadata.external_url);
    expect(token.metadata.animationUrl).toBe(metadata.animation_url);
    expect(token.metadata.backgroundColor).toBe(metadata.background_color);
    expect(token.metadata.youtubeUrl).toBe(metadata.youtube_url);
    metadata.attributes.map((a, i) => {
      expect(token.metadata.attributes[i].traitType).toBe(
        metadata.attributes[i].TraitType,
      );
      expect(token.metadata.attributes[i].value).toBe(
        metadata.attributes[i].Value,
      );
    });

    const transferEventRepository =
      dataSource.getRepository(TransferEventEntity);
    const transferEventEntity = await transferEventRepository.findOne({
      where: { token: { id: token.id } },
    });
    expect(transferEventEntity).toBeDefined();
    expect(transferEventEntity.from).toBe(transferEventArgs[0]);
    expect(transferEventEntity.to).toBe(transferEventArgs[1]);
  });
});
