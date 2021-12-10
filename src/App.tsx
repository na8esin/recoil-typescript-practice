import React, { ErrorInfo, ReactNode } from 'react';
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
    if (response.error) {
      throw response.error;
    }
    return response.name;
  },
});

function CurrentUserInfo() {
  const userName = useRecoilValue(currentUserNameQuery);
  return <div>{userName}</div>;
}

type MyDBQueryRes = { error: string, name: string }

async function myDBQuery(req: { userID: number }): Promise<MyDBQueryRes> {
  const res = await client.get('/fakeApi/user')
  return res.data
}

function App() {
  return (
    <RecoilRoot>
      <ErrorBoundary>
        <React.Suspense fallback={<div>Loading...</div>}>
          <CurrentUserInfo />
        </React.Suspense>
      </ErrorBoundary>
    </RecoilRoot>
  );
}

export default App;

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}
// 参考URL
// https://react-typescript-cheatsheet.netlify.app/docs/basic/getting-started/error_boundaries/
class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(_: Error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // You can also log the error to an error reporting service
    //logErrorToMyService(error, errorInfo);
    console.error("Uncaught error:", error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return <h1>Something went wrong.</h1>;
    }

    return this.props.children;
  }
}