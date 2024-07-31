import { Suspense } from "react";

import Loading from "./components/Loading";
import UserProfile from "./components/UserProfile";

const Home = () => {
  return (
    <Suspense fallback={<Loading />}>
      <UserProfile />
    </Suspense>
  );
}

export default Home;