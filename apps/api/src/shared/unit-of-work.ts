export interface UnitOfWork<W> {
  run<T>(work: (w: W) => Promise<T>): Promise<T>
}
