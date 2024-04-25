import { GraphQLResolveInfo } from 'graphql';
import { ProductModel } from './models/product.model';
import { ProductContextModel } from './context';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
export type RequireFields<T, K extends keyof T> = Omit<T, K> & { [P in K]-?: NonNullable<T[P]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  _FieldSet: { input: any; output: any; }
};

export enum ClientType {
  App = 'APP',
  Site = 'SITE'
}

export enum DateFormat {
  Full = 'FULL',
  Long = 'LONG',
  Medium = 'MEDIUM',
  Short = 'SHORT'
}

export type GetProductInput = {
  email: Scalars['String']['input'];
  test: Scalars['Int']['input'];
  type: GetProductType;
  value: Scalars['String']['input'];
};

export enum GetProductType {
  Sku = 'SKU'
}

export type Heavy = {
  __typename?: 'Heavy';
  description: Scalars['String']['output'];
  id: Scalars['String']['output'];
  name: Scalars['String']['output'];
};

export type Md = {
  __typename?: 'MD';
  id: Scalars['ID']['output'];
  power: Scalars['Float']['output'];
};

export enum Md1 {
  A = 'A',
  B = 'B'
}

export type Md2 = {
  A: Scalars['String']['input'];
};

export type Md3 = {
  X: Scalars['String']['output'];
};

export type Md4 = {
  A: Scalars['Int']['input'];
  B: Scalars['Int']['input'];
};

export type Offer = {
  __typename?: 'Offer';
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
};

export type Price = {
  __typename?: 'Price';
  label: Scalars['String']['output'];
  value: Scalars['Int']['output'];
};

export type Product = {
  __typename?: 'Product';
  createdAt?: Maybe<Scalars['String']['output']>;
  description: Scalars['String']['output'];
  dev?: Maybe<Scalars['Boolean']['output']>;
  heavy?: Maybe<Heavy>;
  name: Scalars['String']['output'];
  offer?: Maybe<Offer>;
  sim: Scalars['String']['output'];
  sku: Scalars['ID']['output'];
};

export type Query = {
  __typename?: 'Query';
  product?: Maybe<Product>;
  productAuth?: Maybe<Product>;
  products: Array<Maybe<Product>>;
  rafa: Scalars['String']['output'];
};


export type QueryProductArgs = {
  data: GetProductInput;
};


export type QueryRafaArgs = {
  arg1?: InputMaybe<Scalars['String']['input']>;
  arg2: Scalars['ID']['input'];
};

export enum TimeFormat {
  Full = 'FULL',
  Long = 'LONG',
  Medium = 'MEDIUM',
  Short = 'SHORT'
}

export type WithIndex<TObject> = TObject & Record<string, any>;
export type ResolversObject<TObject> = WithIndex<TObject>;

export type ResolverTypeWrapper<T> = Promise<T> | T;

export type ReferenceResolver<TResult, TReference, TContext> = (
      reference: TReference,
      context: TContext,
      info: GraphQLResolveInfo
    ) => Promise<TResult> | TResult;

      type ScalarCheck<T, S> = S extends true ? T : NullableCheck<T, S>;
      type NullableCheck<T, S> = Maybe<T> extends T ? Maybe<ListCheck<NonNullable<T>, S>> : ListCheck<T, S>;
      type ListCheck<T, S> = T extends (infer U)[] ? NullableCheck<U, S>[] : GraphQLRecursivePick<T, S>;
      export type GraphQLRecursivePick<T, S> = { [K in keyof T & keyof S]: ScalarCheck<T[K], S[K]> };


export type ResolverWithResolve<TResult, TParent, TContext, TArgs> = {
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> = ResolverFn<TResult, TParent, TContext, TArgs> | ResolverWithResolve<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterable<TResult> | Promise<AsyncIterable<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<TResult, TKey extends string, TParent = {}, TContext = {}, TArgs = {}> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = {}, TContext = {}> = (obj: T, context: TContext, info: GraphQLResolveInfo) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = {}, TParent = {}, TContext = {}, TArgs = {}> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;


/** Mapping of interface types */
export type ResolversInterfaceTypes<RefType extends Record<string, unknown>> = ResolversObject<{
  MD3: never;
}>;

/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = ResolversObject<{
  ClientType: ClientType;
  DateFormat: DateFormat;
  GetProductInput: GetProductInput;
  String: ResolverTypeWrapper<Scalars['String']['output']>;
  Int: ResolverTypeWrapper<Scalars['Int']['output']>;
  GetProductType: GetProductType;
  Heavy: ResolverTypeWrapper<Heavy>;
  MD: ResolverTypeWrapper<Md>;
  ID: ResolverTypeWrapper<Scalars['ID']['output']>;
  Float: ResolverTypeWrapper<Scalars['Float']['output']>;
  MD1: Md1;
  MD2: Md2;
  MD3: ResolverTypeWrapper<ResolversInterfaceTypes<ResolversTypes>['MD3']>;
  MD4: Md4;
  Offer: ResolverTypeWrapper<Offer>;
  Price: ResolverTypeWrapper<Price>;
  Product: ResolverTypeWrapper<ProductModel>;
  Boolean: ResolverTypeWrapper<Scalars['Boolean']['output']>;
  Query: ResolverTypeWrapper<{}>;
  TimeFormat: TimeFormat;
}>;

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = ResolversObject<{
  GetProductInput: GetProductInput;
  String: Scalars['String']['output'];
  Int: Scalars['Int']['output'];
  Heavy: Heavy;
  MD: Md;
  ID: Scalars['ID']['output'];
  Float: Scalars['Float']['output'];
  MD2: Md2;
  MD3: ResolversInterfaceTypes<ResolversParentTypes>['MD3'];
  MD4: Md4;
  Offer: Offer;
  Price: Price;
  Product: ProductModel;
  Boolean: Scalars['Boolean']['output'];
  Query: {};
}>;

export type AuthenticatedDirectiveArgs = { };

export type AuthenticatedDirectiveResolver<Result, Parent, ContextType = ProductContextModel, Args = AuthenticatedDirectiveArgs> = DirectiveResolverFn<Result, Parent, ContextType, Args>;

export type CapitalizeDirectiveArgs = { };

export type CapitalizeDirectiveResolver<Result, Parent, ContextType = ProductContextModel, Args = CapitalizeDirectiveArgs> = DirectiveResolverFn<Result, Parent, ContextType, Args>;

export type CapitalizeAllDirectiveArgs = { };

export type CapitalizeAllDirectiveResolver<Result, Parent, ContextType = ProductContextModel, Args = CapitalizeAllDirectiveArgs> = DirectiveResolverFn<Result, Parent, ContextType, Args>;

export type DateDirectiveArgs = {
  dateFormat?: Maybe<DateFormat>;
  timeFormat?: Maybe<TimeFormat>;
};

export type DateDirectiveResolver<Result, Parent, ContextType = ProductContextModel, Args = DateDirectiveArgs> = DirectiveResolverFn<Result, Parent, ContextType, Args>;

export type DeferDirectiveArgs = { };

export type DeferDirectiveResolver<Result, Parent, ContextType = ProductContextModel, Args = DeferDirectiveArgs> = DirectiveResolverFn<Result, Parent, ContextType, Args>;

export type LengthDirectiveArgs = {
  max?: Maybe<Scalars['Int']['input']>;
};

export type LengthDirectiveResolver<Result, Parent, ContextType = ProductContextModel, Args = LengthDirectiveArgs> = DirectiveResolverFn<Result, Parent, ContextType, Args>;

export type LowerDirectiveArgs = { };

export type LowerDirectiveResolver<Result, Parent, ContextType = ProductContextModel, Args = LowerDirectiveArgs> = DirectiveResolverFn<Result, Parent, ContextType, Args>;

export type RemoveDirectiveArgs = {
  if: ClientType;
};

export type RemoveDirectiveResolver<Result, Parent, ContextType = ProductContextModel, Args = RemoveDirectiveArgs> = DirectiveResolverFn<Result, Parent, ContextType, Args>;

export type UpperDirectiveArgs = { };

export type UpperDirectiveResolver<Result, Parent, ContextType = ProductContextModel, Args = UpperDirectiveArgs> = DirectiveResolverFn<Result, Parent, ContextType, Args>;

export type ValidateDirectiveArgs = {
  isEmail?: Maybe<Scalars['Boolean']['input']>;
  max?: Maybe<Scalars['Int']['input']>;
  maxLength?: Maybe<Scalars['Int']['input']>;
  min?: Maybe<Scalars['Int']['input']>;
  minLength?: Maybe<Scalars['Int']['input']>;
};

export type ValidateDirectiveResolver<Result, Parent, ContextType = ProductContextModel, Args = ValidateDirectiveArgs> = DirectiveResolverFn<Result, Parent, ContextType, Args>;

export type HeavyResolvers<ContextType = ProductContextModel, ParentType extends ResolversParentTypes['Heavy'] = ResolversParentTypes['Heavy']> = ResolversObject<{
  __resolveReference?: ReferenceResolver<Maybe<ResolversTypes['Heavy']>, { __typename: 'Heavy' } & GraphQLRecursivePick<ParentType, {"id":true}>, ContextType>;
  description?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type MdResolvers<ContextType = ProductContextModel, ParentType extends ResolversParentTypes['MD'] = ResolversParentTypes['MD']> = ResolversObject<{
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  power?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type Md3Resolvers<ContextType = ProductContextModel, ParentType extends ResolversParentTypes['MD3'] = ResolversParentTypes['MD3']> = ResolversObject<{
  __resolveType: TypeResolveFn<null, ParentType, ContextType>;
  X?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
}>;

export type OfferResolvers<ContextType = ProductContextModel, ParentType extends ResolversParentTypes['Offer'] = ResolversParentTypes['Offer']> = ResolversObject<{
  __resolveReference?: ReferenceResolver<Maybe<ResolversTypes['Offer']>, { __typename: 'Offer' } & GraphQLRecursivePick<ParentType, {"id":true}>, ContextType>;
  id?: Resolver<ResolversTypes['ID'], { __typename: 'Offer' } & GraphQLRecursivePick<ParentType, {"id":true}>, ContextType>;
  name?: Resolver<ResolversTypes['String'], { __typename: 'Offer' } & GraphQLRecursivePick<ParentType, {"id":true}>, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type PriceResolvers<ContextType = ProductContextModel, ParentType extends ResolversParentTypes['Price'] = ResolversParentTypes['Price']> = ResolversObject<{
  label?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  value?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type ProductResolvers<ContextType = ProductContextModel, ParentType extends ResolversParentTypes['Product'] = ResolversParentTypes['Product']> = ResolversObject<{
  __resolveReference?: ReferenceResolver<Maybe<ResolversTypes['Product']>, { __typename: 'Product' } & GraphQLRecursivePick<ParentType, {"sku":true}>, ContextType>;
  createdAt?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  description?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  dev?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  heavy?: Resolver<Maybe<ResolversTypes['Heavy']>, ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  offer?: Resolver<Maybe<ResolversTypes['Offer']>, ParentType, ContextType>;
  sim?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  sku?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type QueryResolvers<ContextType = ProductContextModel, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = ResolversObject<{
  product?: Resolver<Maybe<ResolversTypes['Product']>, ParentType, ContextType, RequireFields<QueryProductArgs, 'data'>>;
  productAuth?: Resolver<Maybe<ResolversTypes['Product']>, ParentType, ContextType>;
  products?: Resolver<Array<Maybe<ResolversTypes['Product']>>, ParentType, ContextType>;
  rafa?: Resolver<ResolversTypes['String'], ParentType, ContextType, RequireFields<QueryRafaArgs, 'arg2'>>;
}>;

export type Resolvers<ContextType = ProductContextModel> = ResolversObject<{
  Heavy?: HeavyResolvers<ContextType>;
  MD?: MdResolvers<ContextType>;
  MD3?: Md3Resolvers<ContextType>;
  Offer?: OfferResolvers<ContextType>;
  Price?: PriceResolvers<ContextType>;
  Product?: ProductResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
}>;

export type DirectiveResolvers<ContextType = ProductContextModel> = ResolversObject<{
  authenticated?: AuthenticatedDirectiveResolver<any, any, ContextType>;
  capitalize?: CapitalizeDirectiveResolver<any, any, ContextType>;
  capitalizeAll?: CapitalizeAllDirectiveResolver<any, any, ContextType>;
  date?: DateDirectiveResolver<any, any, ContextType>;
  defer?: DeferDirectiveResolver<any, any, ContextType>;
  length?: LengthDirectiveResolver<any, any, ContextType>;
  lower?: LowerDirectiveResolver<any, any, ContextType>;
  remove?: RemoveDirectiveResolver<any, any, ContextType>;
  upper?: UpperDirectiveResolver<any, any, ContextType>;
  validate?: ValidateDirectiveResolver<any, any, ContextType>;
}>;
