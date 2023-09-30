export class Completer<T> {
  public readonly promise: Promise<T>;
  public complete: ((value: PromiseLike<T> | T) => void) | undefined;
  private reject: ((reason?: any) => void) | undefined;

  public constructor() {
    this.promise = new Promise<T>((resolve, reject) => {
      this.complete = resolve;
      this.reject = reject;
    });
  }
}
