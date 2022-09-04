import { atom } from 'recoil';
import UserData from 'types/userInfo';

const userDataState = atom<UserData>({
  key: 'userDataState',
  default: {
    uuid: null,
    token: null,
  },
});
export default userDataState;
