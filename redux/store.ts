import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./features/auth/authSlice";
import dashboardSlice from "./features/dashboard/dashboardSlice";
import schoolSlice from "./features/school/schoolSlice";
import teacherSlice from "./features/teacher/teacherSlice";

const store = configureStore({
  reducer: {
    auth: authSlice,
    dashboard: dashboardSlice,
    school: schoolSlice,
    teacher: teacherSlice,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;

export default store;
