// import { useEffect } from "react";

// import { Toaster } from "react-hot-toast";
// import { useDispatch } from "react-redux";
// import { getUserProfileThunk } from "./store/slice/user/user.thunk";

// function App() {
  
//   const dispatch = useDispatch();

//   useEffect(() => {
//     (async () => {
//       await dispatch(getUserProfileThunk());
//     })();
//   }, []);

//   return (
//     <>
//       <Toaster position="top-center" reverseOrder={false} />
//     </>
//   );
// }

// export default App;

import { useEffect } from "react";
import { Toaster } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";

import { getUserProfileThunk } from "./store/slice/user/user.thunk";
import {
  initializeSocket,
  setOnlineUsers,
} from "./store/slice/socket/socket.slice";

function App() {
  const dispatch = useDispatch();

  const { authUser } = useSelector((state) => state.userReducer);
  const { socket } = useSelector((state) => state.socketReducer);

  // 1️⃣ get logged-in user
  useEffect(() => {
    dispatch(getUserProfileThunk());
  }, []);

  // 2️⃣ initialize socket AFTER user is available
  useEffect(() => {
    if (authUser?._id && !socket) {
      dispatch(initializeSocket(authUser._id));
    }
  }, [authUser]);

  // 3️⃣ listen online users (🔥 MAIN FIX)
  useEffect(() => {
    if (!socket) return;

    socket.on("onlineUsers", (users) => {
      dispatch(setOnlineUsers(users));
    });

    return () => {
      socket.off("onlineUsers");
    };
  }, [socket]);

  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />
    </>
  );
}

export default App;
