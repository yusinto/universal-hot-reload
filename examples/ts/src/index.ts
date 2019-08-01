import { serverHotReload } from 'universal-hot-reload';

serverHotReload(require.resolve('./server.ts'));