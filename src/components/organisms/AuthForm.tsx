import axios from 'axios';
import FormButton from 'components/molecules/FormButton';
import FormInput from 'components/molecules/FormInput';
import useUserDataState from 'hooks/useUserDataState';
import {
  Dispatch,
  FormEventHandler,
  SetStateAction,
  useState,
  VFC,
  useCallback,
} from 'react';
import { useNavigate } from 'react-router-dom';

import ReactGA from 'react-ga4';

type Props = {
  setIsLoading: Dispatch<SetStateAction<boolean>>;
};
const AuthForm: VFC<Props> = ({ setIsLoading }) => {
  const [id, setId] = useState('');
  const [pw, setPw] = useState('');
  const [authResult, setAuthResult] = useState<null | boolean>(null);
  const setUserDataHandler = useUserDataState();
  const navigate = useNavigate();
  /**
   * input時に発火
   * stateを更新する
   * @date 2022-02-23
   * @param {FormEventHandler} { currentTarget }
   * @returns {void}
   */
  const onInput: FormEventHandler<HTMLInputElement> = useCallback(
    ({ currentTarget }) => {
      switch (currentTarget.name) {
        case 'id':
          setId(currentTarget.value);
          break;
        case 'pw':
          setPw(currentTarget.value);
          break;
        default:
          console.error('key が正しくありません');
          break;
      }
    },
    [setId, setPw],
  );

  /**
   * submit時に発火
   * ログイン情報が正しいかを判断し、正しければatomにデータをセットする。
   * 正しくない場合はエラ〜メッセージを出力する
   * @date 2022-02-23
   * @param {FormEventHandler} e
   * @returns {void}
   */
  const onSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    axios
      .post<{
        message: 'success' | 'error';
        status: 200 | 401;
        token: string;
      }>(`${process.env.REACT_APP_API_URL}/signin`, {
        id,
        pw,
      })
      .then((response) => {
        if (!response) return console.error('通信に失敗しました。');
        if (response.status !== 200) return setAuthResult(false);
        setAuthResult(true);
        axios
          .get<{
            uuid: string;
          }>(`${process.env.REACT_APP_API_URL}/uuid`, {
            headers: {
              Authorization: `Bearer ${response.data.token}`,
            },
          })
          .then((_response) => {
            if (!_response) return console.error('通信に失敗しました。');
            if (_response.status !== 200) return setAuthResult(false);
            setUserDataHandler(_response.data.uuid, response.data.token);
            ReactGA.event('signin_success');
            navigate('/');
            setIsLoading(false);
          });
      })
      .catch(() => {
        // eslint-disable-next-line no-alert
        alert('ログインに失敗しました');
        setIsLoading(false);
        ReactGA.event('signin_failure');
      });
  };

  return (
    <form className='space-y-6' onSubmit={onSubmit}>
      <FormInput
        id='id'
        name='id'
        type='tel'
        placeholder='2000000'
        onInput={onInput}
      >
        Student number
      </FormInput>
      <FormInput
        id='pw'
        name='pw'
        type='password'
        placeholder='Your Password'
        onInput={onInput}
      >
        Password
      </FormInput>
      {authResult !== null && !authResult && (
        <span className='text-xs text-red-700'>
          ユーザーID・パスワードに誤りがあるか、登録されていません。
        </span>
      )}
      <FormButton type='submit'>Sign in</FormButton>
    </form>
  );
};

export default AuthForm;
