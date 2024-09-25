import type { BaseContract, BigNumberish, BytesLike, FunctionFragment, Result, Interface, EventFragment, AddressLike, ContractRunner, ContractMethod, Listener } from "ethers";
import type { TypedContractEvent, TypedDeferredTopicFilter, TypedEventLog, TypedLogDescription, TypedListener, TypedContractMethod } from "../../common";
export interface MarketInterface extends Interface {
    getFunction(nameOrSignature: "_marketplaceFeePercent" | "_nftContractAddress" | "buyNft" | "changeListingActiveStatus" | "listNft" | "listings" | "owner" | "pendingWithdrawals" | "renounceOwnership" | "setMarketFeePercent" | "transferOwnership" | "unlistNft" | "withdraw"): FunctionFragment;
    getEvent(nameOrSignatureOrTopic: "MarketFeePercentChanged" | "MarketListingActiveStatusChanged" | "NftListed" | "NftPurchased" | "NftUnlisted" | "OwnershipTransferred"): EventFragment;
    encodeFunctionData(functionFragment: "_marketplaceFeePercent", values?: undefined): string;
    encodeFunctionData(functionFragment: "_nftContractAddress", values?: undefined): string;
    encodeFunctionData(functionFragment: "buyNft", values: [BigNumberish]): string;
    encodeFunctionData(functionFragment: "changeListingActiveStatus", values: [BigNumberish, boolean]): string;
    encodeFunctionData(functionFragment: "listNft", values: [BigNumberish, BigNumberish]): string;
    encodeFunctionData(functionFragment: "listings", values: [BigNumberish]): string;
    encodeFunctionData(functionFragment: "owner", values?: undefined): string;
    encodeFunctionData(functionFragment: "pendingWithdrawals", values: [AddressLike]): string;
    encodeFunctionData(functionFragment: "renounceOwnership", values?: undefined): string;
    encodeFunctionData(functionFragment: "setMarketFeePercent", values: [BigNumberish]): string;
    encodeFunctionData(functionFragment: "transferOwnership", values: [AddressLike]): string;
    encodeFunctionData(functionFragment: "unlistNft", values: [BigNumberish]): string;
    encodeFunctionData(functionFragment: "withdraw", values?: undefined): string;
    decodeFunctionResult(functionFragment: "_marketplaceFeePercent", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "_nftContractAddress", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "buyNft", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "changeListingActiveStatus", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "listNft", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "listings", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "owner", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "pendingWithdrawals", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "renounceOwnership", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "setMarketFeePercent", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "transferOwnership", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "unlistNft", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "withdraw", data: BytesLike): Result;
}
export declare namespace MarketFeePercentChangedEvent {
    type InputTuple = [newFeePercent: BigNumberish];
    type OutputTuple = [newFeePercent: bigint];
    interface OutputObject {
        newFeePercent: bigint;
    }
    type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
    type Filter = TypedDeferredTopicFilter<Event>;
    type Log = TypedEventLog<Event>;
    type LogDescription = TypedLogDescription<Event>;
}
export declare namespace MarketListingActiveStatusChangedEvent {
    type InputTuple = [isActive: boolean];
    type OutputTuple = [isActive: boolean];
    interface OutputObject {
        isActive: boolean;
    }
    type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
    type Filter = TypedDeferredTopicFilter<Event>;
    type Log = TypedEventLog<Event>;
    type LogDescription = TypedLogDescription<Event>;
}
export declare namespace NftListedEvent {
    type InputTuple = [
        seller: AddressLike,
        tokenId: BigNumberish,
        price: BigNumberish
    ];
    type OutputTuple = [seller: string, tokenId: bigint, price: bigint];
    interface OutputObject {
        seller: string;
        tokenId: bigint;
        price: bigint;
    }
    type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
    type Filter = TypedDeferredTopicFilter<Event>;
    type Log = TypedEventLog<Event>;
    type LogDescription = TypedLogDescription<Event>;
}
export declare namespace NftPurchasedEvent {
    type InputTuple = [
        buyer: AddressLike,
        tokenId: BigNumberish,
        price: BigNumberish
    ];
    type OutputTuple = [buyer: string, tokenId: bigint, price: bigint];
    interface OutputObject {
        buyer: string;
        tokenId: bigint;
        price: bigint;
    }
    type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
    type Filter = TypedDeferredTopicFilter<Event>;
    type Log = TypedEventLog<Event>;
    type LogDescription = TypedLogDescription<Event>;
}
export declare namespace NftUnlistedEvent {
    type InputTuple = [owner: AddressLike, tokenId: BigNumberish];
    type OutputTuple = [owner: string, tokenId: bigint];
    interface OutputObject {
        owner: string;
        tokenId: bigint;
    }
    type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
    type Filter = TypedDeferredTopicFilter<Event>;
    type Log = TypedEventLog<Event>;
    type LogDescription = TypedLogDescription<Event>;
}
export declare namespace OwnershipTransferredEvent {
    type InputTuple = [previousOwner: AddressLike, newOwner: AddressLike];
    type OutputTuple = [previousOwner: string, newOwner: string];
    interface OutputObject {
        previousOwner: string;
        newOwner: string;
    }
    type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
    type Filter = TypedDeferredTopicFilter<Event>;
    type Log = TypedEventLog<Event>;
    type LogDescription = TypedLogDescription<Event>;
}
export interfaceOpenMarketplaceextends BaseContract {
    connect(runner?: ContractRunner | null): Market;
    waitForDeployment(): Promise<this>;
    interface: MarketInterface;
    queryFilter<TCEvent extends TypedContractEvent>(event: TCEvent, fromBlockOrBlockhash?: string | number | undefined, toBlock?: string | number | undefined): Promise<Array<TypedEventLog<TCEvent>>>;
    queryFilter<TCEvent extends TypedContractEvent>(filter: TypedDeferredTopicFilter<TCEvent>, fromBlockOrBlockhash?: string | number | undefined, toBlock?: string | number | undefined): Promise<Array<TypedEventLog<TCEvent>>>;
    on<TCEvent extends TypedContractEvent>(event: TCEvent, listener: TypedListener<TCEvent>): Promise<this>;
    on<TCEvent extends TypedContractEvent>(filter: TypedDeferredTopicFilter<TCEvent>, listener: TypedListener<TCEvent>): Promise<this>;
    once<TCEvent extends TypedContractEvent>(event: TCEvent, listener: TypedListener<TCEvent>): Promise<this>;
    once<TCEvent extends TypedContractEvent>(filter: TypedDeferredTopicFilter<TCEvent>, listener: TypedListener<TCEvent>): Promise<this>;
    listeners<TCEvent extends TypedContractEvent>(event: TCEvent): Promise<Array<TypedListener<TCEvent>>>;
    listeners(eventName?: string): Promise<Array<Listener>>;
    removeAllListeners<TCEvent extends TypedContractEvent>(event?: TCEvent): Promise<this>;
    _marketplaceFeePercent: TypedContractMethod<[], [bigint], "view">;
    _nftContractAddress: TypedContractMethod<[], [string], "view">;
    buyNft: TypedContractMethod<[tokenId: BigNumberish], [void], "payable">;
    changeListingActiveStatus: TypedContractMethod<[
        tokenId: BigNumberish,
        isActive: boolean
    ], [
        void
    ], "nonpayable">;
    listNft: TypedContractMethod<[
        tokenId: BigNumberish,
        price: BigNumberish
    ], [
        void
    ], "nonpayable">;
    listings: TypedContractMethod<[
        arg0: BigNumberish
    ], [
        [
            bigint,
            bigint,
            bigint,
            boolean
        ] & {
            tokenId: bigint;
            price: bigint;
            marketPlaceFee: bigint;
            isActive: boolean;
        }
    ], "view">;
    owner: TypedContractMethod<[], [string], "view">;
    pendingWithdrawals: TypedContractMethod<[
        arg0: AddressLike
    ], [
        bigint
    ], "view">;
    renounceOwnership: TypedContractMethod<[], [void], "nonpayable">;
    setMarketFeePercent: TypedContractMethod<[
        newFeePercent: BigNumberish
    ], [
        void
    ], "nonpayable">;
    transferOwnership: TypedContractMethod<[
        newOwner: AddressLike
    ], [
        void
    ], "nonpayable">;
    unlistNft: TypedContractMethod<[tokenId: BigNumberish], [void], "nonpayable">;
    withdraw: TypedContractMethod<[], [void], "nonpayable">;
    getFunction<T extends ContractMethod = ContractMethod>(key: string | FunctionFragment): T;
    getFunction(nameOrSignature: "_marketplaceFeePercent"): TypedContractMethod<[], [bigint], "view">;
    getFunction(nameOrSignature: "_nftContractAddress"): TypedContractMethod<[], [string], "view">;
    getFunction(nameOrSignature: "buyNft"): TypedContractMethod<[tokenId: BigNumberish], [void], "payable">;
    getFunction(nameOrSignature: "changeListingActiveStatus"): TypedContractMethod<[
        tokenId: BigNumberish,
        isActive: boolean
    ], [
        void
    ], "nonpayable">;
    getFunction(nameOrSignature: "listNft"): TypedContractMethod<[
        tokenId: BigNumberish,
        price: BigNumberish
    ], [
        void
    ], "nonpayable">;
    getFunction(nameOrSignature: "listings"): TypedContractMethod<[
        arg0: BigNumberish
    ], [
        [
            bigint,
            bigint,
            bigint,
            boolean
        ] & {
            tokenId: bigint;
            price: bigint;
            marketPlaceFee: bigint;
            isActive: boolean;
        }
    ], "view">;
    getFunction(nameOrSignature: "owner"): TypedContractMethod<[], [string], "view">;
    getFunction(nameOrSignature: "pendingWithdrawals"): TypedContractMethod<[arg0: AddressLike], [bigint], "view">;
    getFunction(nameOrSignature: "renounceOwnership"): TypedContractMethod<[], [void], "nonpayable">;
    getFunction(nameOrSignature: "setMarketFeePercent"): TypedContractMethod<[newFeePercent: BigNumberish], [void], "nonpayable">;
    getFunction(nameOrSignature: "transferOwnership"): TypedContractMethod<[newOwner: AddressLike], [void], "nonpayable">;
    getFunction(nameOrSignature: "unlistNft"): TypedContractMethod<[tokenId: BigNumberish], [void], "nonpayable">;
    getFunction(nameOrSignature: "withdraw"): TypedContractMethod<[], [void], "nonpayable">;
    getEvent(key: "MarketFeePercentChanged"): TypedContractEvent<MarketFeePercentChangedEvent.InputTuple, MarketFeePercentChangedEvent.OutputTuple, MarketFeePercentChangedEvent.OutputObject>;
    getEvent(key: "MarketListingActiveStatusChanged"): TypedContractEvent<MarketListingActiveStatusChangedEvent.InputTuple, MarketListingActiveStatusChangedEvent.OutputTuple, MarketListingActiveStatusChangedEvent.OutputObject>;
    getEvent(key: "NftListed"): TypedContractEvent<NftListedEvent.InputTuple, NftListedEvent.OutputTuple, NftListedEvent.OutputObject>;
    getEvent(key: "NftPurchased"): TypedContractEvent<NftPurchasedEvent.InputTuple, NftPurchasedEvent.OutputTuple, NftPurchasedEvent.OutputObject>;
    getEvent(key: "NftUnlisted"): TypedContractEvent<NftUnlistedEvent.InputTuple, NftUnlistedEvent.OutputTuple, NftUnlistedEvent.OutputObject>;
    getEvent(key: "OwnershipTransferred"): TypedContractEvent<OwnershipTransferredEvent.InputTuple, OwnershipTransferredEvent.OutputTuple, OwnershipTransferredEvent.OutputObject>;
    filters: {
        "MarketFeePercentChanged(uint256)": TypedContractEvent<MarketFeePercentChangedEvent.InputTuple, MarketFeePercentChangedEvent.OutputTuple, MarketFeePercentChangedEvent.OutputObject>;
        MarketFeePercentChanged: TypedContractEvent<MarketFeePercentChangedEvent.InputTuple, MarketFeePercentChangedEvent.OutputTuple, MarketFeePercentChangedEvent.OutputObject>;
        "MarketListingActiveStatusChanged(bool)": TypedContractEvent<MarketListingActiveStatusChangedEvent.InputTuple, MarketListingActiveStatusChangedEvent.OutputTuple, MarketListingActiveStatusChangedEvent.OutputObject>;
        MarketListingActiveStatusChanged: TypedContractEvent<MarketListingActiveStatusChangedEvent.InputTuple, MarketListingActiveStatusChangedEvent.OutputTuple, MarketListingActiveStatusChangedEvent.OutputObject>;
        "NftListed(address,uint256,uint256)": TypedContractEvent<NftListedEvent.InputTuple, NftListedEvent.OutputTuple, NftListedEvent.OutputObject>;
        NftListed: TypedContractEvent<NftListedEvent.InputTuple, NftListedEvent.OutputTuple, NftListedEvent.OutputObject>;
        "NftPurchased(address,uint256,uint256)": TypedContractEvent<NftPurchasedEvent.InputTuple, NftPurchasedEvent.OutputTuple, NftPurchasedEvent.OutputObject>;
        NftPurchased: TypedContractEvent<NftPurchasedEvent.InputTuple, NftPurchasedEvent.OutputTuple, NftPurchasedEvent.OutputObject>;
        "NftUnlisted(address,uint256)": TypedContractEvent<NftUnlistedEvent.InputTuple, NftUnlistedEvent.OutputTuple, NftUnlistedEvent.OutputObject>;
        NftUnlisted: TypedContractEvent<NftUnlistedEvent.InputTuple, NftUnlistedEvent.OutputTuple, NftUnlistedEvent.OutputObject>;
        "OwnershipTransferred(address,address)": TypedContractEvent<OwnershipTransferredEvent.InputTuple, OwnershipTransferredEvent.OutputTuple, OwnershipTransferredEvent.OutputObject>;
        OwnershipTransferred: TypedContractEvent<OwnershipTransferredEvent.InputTuple, OwnershipTransferredEvent.OutputTuple, OwnershipTransferredEvent.OutputObject>;
    };
}
