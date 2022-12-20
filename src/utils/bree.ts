// import Bree from 'bree';
//
// const {
//   bree: { checkHostsOnlineCron, importAccountTxsCron },
// } = config;
//
// const getBree = () => {
//   const bree = new Bree({
//     logger: false,
//     defaultExtension: process.env.TS_NODE ? 'ts' : 'js',
//     root: path.join(__dirname, '../jobs'),
//     jobs: [
//       { name: 'checkHostsOnline', cron: checkHostsOnlineCron },
//       { name: 'importAccountTxs', cron: importAccountTxsCron },
//     ],
//     errorHandler: (error: Error, workerMetadata: { name: string; err?: Error }) => {
//       logger.error('Bree error', { data: { error, workerMetadata } });
//     },
//     workerMessageHandler: (message: { name: string; message: unknown }) => {
//       logger.debug('Worker completed', { data: { ...message } });
//     },
//   });
//
//   bree.on('worker created', (name: string) => {
//     logger.debug('Worker created', { data: { name } });
//   });
//   bree.on('worker deleted', (name: string) => {
//     logger.debug('Worker deleted', { data: { name } });
//   });
//
//   return bree;
// };
//
// export default getBree();
