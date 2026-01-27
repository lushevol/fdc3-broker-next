import { getHooksBase } from '../HooksBase';
import service from './config';
import { getEndPoint } from './util/getEndpoint';

export interface ConfigProps {
  signal?: any;
  headers?: any;
}

export const signal = {
  getRefreshToken: undefined as any,
  relogin: undefined as any,
};

export const getRefreshToken = () => {
  if (signal?.getRefreshToken) {
    signal?.getRefreshToken?.abort();
  }
  signal.getRefreshToken = new AbortController();
  const { store } = getHooksBase();
  service
    .post(
      getEndPoint('/auth/v2/sso/refreshtoken'),
      { singleUIAuthorization: store.token },
      {
        signal: signal.getRefreshToken.signal,
      },
    )
    .catch((e) => {
      console.error('e', e);
    });
};

export const relogin = () => {
  if (signal?.relogin) {
    signal?.relogin?.abort();
  }
  signal.relogin = new AbortController();
  service
    .post(
      getEndPoint('/auth/v2/sso/relogin'),
      {},
      {
        signal: signal.relogin.signal,
      },
    )
    .catch((e) => {
      console.error('e', e);
    });
};

const putService = (path, data, config?: ConfigProps) => {
  return service.put(getEndPoint(path), data, config);
};

const postService = (path, data, config?: ConfigProps) => {
  return service.post(getEndPoint(path), data, config);
};

const getService = (path, config?: ConfigProps) => {
  return service.get(getEndPoint(path), config);
};

const deleteService = (path, config?: ConfigProps) => {
  return service.delete(getEndPoint(path), config);
};

const patchService = (path, data, config?: ConfigProps) => {
  return service.patch(getEndPoint(path), data, config);
};

export { putService, postService, getService, deleteService, patchService, service };
