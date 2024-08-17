type UnionToIntersection<U> = (
  U extends any ? (arg: U) => any : never
) extends (arg: infer I) => void
  ? I
  : never;

type Prettify<T> = {
  [K in keyof T]: T[K];
} & {};

type Reduce<T extends any[]> = Prettify<UnionToIntersection<T[number]>>;

type Build<TBuilders extends Builder<any, any, any>[]> = {
  [index in number]: TBuilders[index] extends Builder<any, any, any>
    ? ReturnType<TBuilders[index]["build"]>
    : never;
}[number];

class Builder<
  TName extends string,
  TParams extends any[],
  TNodes extends Builder<any, any, any>[],
> {
  private constructor(
    private name: TName,
    private params: TParams,
    private nodes: TNodes,
  ) {}

  static Node<TNodeName extends string>(name: TNodeName) {
    return new Builder(name, [], []);
  }

  addParam<TKey extends PropertyKey, TValue extends any>(
    key: TKey,
    value: TValue,
  ): Builder<
    TName,
    TParams extends never[]
      ? [Record<TKey, TValue>]
      : [...TParams, Record<TKey, TValue>],
    TNodes
  > {
    this.params.push({ [key]: value });
    return this as any;
  }

  addNode<TBuilder extends Builder<any, any, any>>(
    builder: TBuilder,
  ): Builder<
    TName,
    TParams,
    TNodes extends never[] ? [TBuilder] : [...TNodes, TBuilder]
  > {
    this.nodes.push(builder);
    return this as any;
  }

  build(): Prettify<Record<TName, Reduce<[...TParams, Build<TNodes>]>>> {
    return {
      [this.name]: [...this.params, ...this.nodes.map((n) => n.build())].reduce(
        (node, value) => ({ ...node, ...value }),
        {} as any,
      ),
    } as any;
  }
}

export const b = Builder;
