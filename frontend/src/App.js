import { BrowserRouter, Route, Switch } from "react-router-dom";
import AppLayout from "./Layouts/AppLayout";
import "./App.css";
import AdminRoute from "./Route/AdminRoute";
import Home from "./Pages/Home/Home";
import PrevFilterContext from "./context/PrevFilterContext";
import Signin from "./Pages/Signin";
import Signup from "./Pages/Signup";
import AccountSetting from "./Pages/AccountSetting";
import AccountGrade from "./Pages/AccountSetting/AccountGrade";
import LogOut from "./Pages/Logout";
import PageNotFound from "./Pages/PageNotFound";
import ForgotPassword from "./Pages/ForgotPassword";
import ResetPassword from "./Pages/ResetPassword";
import DetailAssignment from "./Pages/DetailAssignment";

import Dashboard from "./Pages/Admin/Dashboard";
import MainLayout from "./Components/Admin/MainLayout";
import User from "./Pages/Admin/UserAdmin/User";
import Classroom from "./Pages/Classroom";
import ClassroomAdmin from "./Pages/Admin/ClassroomAdmin/ClassroomAdmin";
import CreateClass from "./Pages/Classroom/Components/CreateClass";
import DetailClass from "./Pages/DetailClassroom";
import ClassDirectJoining from "./Pages/JoinClassroom/ClassDirectJoining";
import ClassEmailJoining from "./Pages/JoinClassroom/ClassEmailJoining";
import CreateAssignment from "./Pages/CreateAssignment";
import ClassCodeJoining from "./Pages/JoinClassroom/ClassCodeJoining";
import DetailStudentGrade from "./Pages/DetailStudentGrade";
import DetailGradeReview from "./Pages/DetailGradeReview";

function App() {

  return (
    <BrowserRouter>
      <Switch>
        <Route path="/">
          <PrevFilterContext>
            <Switch>
              <Route path="/" exact>
                <AppLayout>
                  <Home />
                </AppLayout>
              </Route>
              <Route path="/account/grade" exact>
                <AppLayout>
                  <AccountGrade />
                </AppLayout>
              </Route>
              <Route path="/account" exact>
                <AppLayout>
                  <AccountSetting />
                </AppLayout>
              </Route>
              <Route path="/classroom" exact>
                <AppLayout>
                  <Classroom />
                </AppLayout>
              </Route>
              <Route path="/classroom/join" exact>
                <AppLayout>
                  <ClassCodeJoining />
                </AppLayout>
              </Route>
              <Route path="/classroom/:id/join/link" exact>
                <AppLayout>
                  <ClassDirectJoining />
                </AppLayout>
              </Route>
              <Route path="/classroom/invite/accept_token/:id" exact>
                <AppLayout>
                  <ClassEmailJoining />
                </AppLayout>
              </Route>
              <Route path="/classroom/:id" exact>
                <AppLayout>
                  <DetailClass />
                </AppLayout>
              </Route>
              <Route path="/classroom/:classId/student/:studentId" exact>
                <AppLayout>
                  <DetailStudentGrade />
                </AppLayout>
              </Route>
              <Route path="/create-class" exact>
                <AppLayout>
                  <CreateClass />
                </AppLayout>
              </Route>
              <Route path="/assignment/:assignmentId" exact>
                <AppLayout>
                  <DetailAssignment />
                </AppLayout>
              </Route>
              <AdminRoute path="/dashboard" exact>
                <MainLayout>
                  <Dashboard />
                </MainLayout>
              </AdminRoute>
              <AdminRoute path="/admin/user" exact>
                <MainLayout>
                  <User />
                </MainLayout>
              </AdminRoute>
              <AdminRoute path="/admin/classroom" exact>
                <MainLayout>
                  <ClassroomAdmin />
                </MainLayout>
              </AdminRoute>
              <Route path="/sign-up">
                <AppLayout>
                  <Signup />
                </AppLayout>
              </Route>
              <Route path="/sign-in" exact>
                <AppLayout>
                  <Signin />
                </AppLayout>
              </Route>
              <Route path="/create-assignment">
                <AppLayout>
                  <CreateAssignment />
                </AppLayout>
              </Route>
              <Route path="/classroom/:classId/grade-review/:id">
                <AppLayout>
                  <DetailGradeReview />
                </AppLayout>
              </Route>
              <Route path="/logout">
                <AppLayout>
                  <LogOut />
                </AppLayout>
              </Route>
              <Route path="/forgot-password">
                <AppLayout>
                  <ForgotPassword />
                </AppLayout>
              </Route>
              <Route path="/activenewpass">
                <AppLayout>
                  <ResetPassword />
                </AppLayout>
              </Route>
              <Route path="*">
                <PageNotFound />
              </Route>
            </Switch>
          </PrevFilterContext>
        </Route>
      </Switch>
    </BrowserRouter>
  );
}

export default App;
