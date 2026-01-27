import React from 'react';
import useDispatcher from '../../../hooks/dispathcer';
import useServices from '../../../services';
import { getEnv } from '../../../utils/common';

const useController = () => {
  const { dispacthLoading, dispacthErrorMessage } = useDispatcher();
  const [loading, setLoading] = React.useState(false);
  const [username, setUsername] = React.useState<string>('test');
  const [password, setPassword] = React.useState<string>('test');
  const { login } = useServices();
  const [code, setCode] = React.useState();
  const [client_id, setClient_id] = React.useState();
  const [iss, setIss] = React.useState();
  const [value, setValue] = React.useState(0);
  const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };
  React.useEffect(() => {
    dispacthLoading(false);
    const params: any = new URLSearchParams(window.location.search);
    const checkCode = params?.get('code');
    if (checkCode) {
      setCode(checkCode);
      setIss(params?.get('iss'));
      setClient_id(params?.get('client_id'));
      setUsername('');
      setPassword('');
    }
  }, []);
  React.useEffect(() => {
    if (code && iss && client_id) {
      onLogin({ code, iss, client_id });
    }
  }, [code, iss, client_id]);

  const onLogin = async (data) => {
    dispacthErrorMessage(undefined);
    setLoading(true);
    await login(data);
    setLoading(false);
  };
  const onLoginUserNamePassword = () => {
    if (username && password) {
      onLogin({ username: username.trim(), password: password.trim() });
    }
  };
  const onKeyUp = (e) => {
    if (e.code === 'Enter') {
      onLoginUserNamePassword();
    }
  };
  const onKeyUpPassword = (e) => {
    if (e.code === 'Enter') {
      onLoginUserNamePassword();
    } else {
      setPassword(`${e.target.value}`.trim());
    }
  };
  const showNormalLogin = React.useMemo(() => {
    if (['PROD'].includes(getEnv())) {
      const params: any = new URLSearchParams(window.location.search);
      const showNormalLogin = params?.get('show_normal_login');
      if (!['Y', 'y'].includes(showNormalLogin)) {
        return false;
      }
    }
    return true;
  }, []);

  return {
    username,
    setUsername,
    password,
    setPassword,
    onLogin,
    onLoginUserNamePassword,
    handleChange,
    value,
    onKeyUp,
    loading,
    showNormalLogin,
    onKeyUpPassword,
  };
};

export default useController;
