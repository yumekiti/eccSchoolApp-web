import userDataState from 'globalState/userDataState';
import { useSetRecoilState } from 'recoil';

/**
 * atomとlocalstorageにデータを格納する関数を返します。
 * @date 2022-02-23
 * @returns {Function}
 */
const useUserDataState = () => {
  const setUserData = useSetRecoilState(userDataState);
  /**
   * ユーザーデータを受け取り、atomとlocalstorageに格納します。
   * @date 2022-02-23
   * @param {string} uuid
   * @param {string}  token
   * @returns {void}
   */
  const setUserDataHandler = (uuid: string, token: string) => {
    setUserData({ uuid, token });
    localStorage.setItem('uuid', uuid);
    localStorage.setItem('token', token);
  };
  return setUserDataHandler;
};
export default useUserDataState;
