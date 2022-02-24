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

type Props = {
  setIsLoading: Dispatch<SetStateAction<boolean>>;
};
const AuthForm: VFC<Props> = ({ setIsLoading }) => {
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
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
        case 'userId':
          setUserId(currentTarget.value);
          break;
        case 'password':
          setPassword(currentTarget.value);
          break;
        default:
          console.error('key が正しくありません');
          break;
      }
    },
    [setUserId, setPassword],
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
    const { data } = await axios.post<{
      message: 'success' | 'error';
      status: 200 | 401;
    }>(`${process.env.REACT_APP_API_URL}/signin`, {
      userId,
      password,
    });
    setIsLoading(false);
    if (!data) return console.error('通信に失敗しました。');
    if (data.status !== 200) return setAuthResult(false);

    setAuthResult(true);
    setUserDataHandler(userId, password);
    navigate('/');
  };

  return (
    <form className='space-y-6' onSubmit={onSubmit}>
      <FormInput
        id='userId'
        name='userId'
        type='tel'
        placeholder='2000000'
        onInput={onInput}
      >
        Student number
      </FormInput>
      <FormInput
        id='password'
        name='password'
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
