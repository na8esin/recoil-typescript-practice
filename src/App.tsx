import React from 'react';
import {
  RecoilRoot,
  selector,
  useRecoilValue,
  atom
} from 'recoil';

import { client } from './api/client'

const currentUserIDState = atom({
  key: 'CurrentUserID',
  default: 1,
});

const currentUserNameQuery = selector({
  key: 'CurrentUserName',
  get: async ({ get }) => {
    const response = await myDBQuery({
      userID: get(currentUserIDState),
    });
    return response.name;
  },
});

function CurrentUserInfo() {
  const userName = useRecoilValue(currentUserNameQuery);
  return <div>{userName}</div>;
}

async function myDBQuery(req: { userID: number }): Promise<{ name: string }> {
  const res = await client.get('/fakeApi/user')
  return res.data
}

function App() {
  return (
    <RecoilRoot>
      <React.Suspense fallback={<div>Loading...</div>}>
        <CurrentUserInfo />
      </React.Suspense>
    </RecoilRoot>
  );
}

export default App;
