export interface IIterable<T> {
	[Symbol.iterator](): Iterator<T>;
}