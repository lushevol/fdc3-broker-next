export function setWorker(GlobalWorkerOptions: any) {
  GlobalWorkerOptions.workerSrc = new URL(
    '../../pdf.worker.min.js',
    import.meta.url
  ).toString();
}
