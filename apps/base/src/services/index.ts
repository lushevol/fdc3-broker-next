import type { Workspace } from '../hooks/model/workspaces';
import { useContext } from '../hooks/provider';
import { getService, postService } from '../hooks/service';
import { clearStorageWhenLogout, getEnv } from '../utils/common';
import { findTile } from '../utils/drawer';

const useServices = () => {
  const [store, dispacth] = useContext();
  const login = async (data) => {
    try {
      await postService('/auth/v2/sso/login', { ...data });
    } catch (e) {}
  };
  const logout = () => {
    const arr = [
      postService('/auth/v2/sso/logout', {
        singleUIAuthorization: store.token,
      }),
      getService('/ssiplus/imeta/logout'),
    ];
    Promise.all(arr).catch((e) => {
      console.error('e', e);
    });
    clearStorageWhenLogout(dispacth);
  };
  const validate = async () => {
    try {
      const { data } = await postService('/auth/v2/sso/validate', {
        singleUIAuthorization: store.token,
      });
      if (data?.result) {
        return data?.result;
      }
    } catch (e) {}
    return false;
  };
  const ssePublish = async (tabId, _payload) => {
    try {
      if (['LOCAL'].includes(getEnv())) {
        const workspaces = [...(store?.workspaces as Workspace[])];
        const index = workspaces.findIndex((workspace) => workspace.id === tabId);
        findTile(store.drawers, workspaces[index]);
      }
    } catch (e) {}
  };
  return {
    login,
    validate,
    logout,
    ssePublish,
  };
};

export default useServices;
