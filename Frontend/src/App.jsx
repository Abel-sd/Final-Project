import { Route, Routes } from "react-router";


import AuthOutlet from '@auth-kit/react-router/AuthOutlet';
import DonerDashboard from "./Pages/DonerDashboard";
import Profile from "./Pages/Profile";
import HeaderCombine from "./Components/HeaderCombine";
import HospitalDashboard from "./Pages/HospitalDashboard";
import HospitalBloodRequest from "./Pages/HospitalBloodRequest";
import SchedulesPage from "./Pages/SchedulesPage";
import HospitalProfilePage from "./Pages/HospitalProfilePage";
import AdminDashboard from "./Pages/AdminDashboard";
import AdminHospital from "./Pages/AdminHospital";
import AdminDoner from "./Pages/AdminDoner";
import AdminBloodRequest from "./Pages/AdminBloodRequest";
import LoginPage from "./Pages/LoginPage";
import RegisterPage from "./Pages/Registerpage";
import PrivateRoute from "./Components/PrivateRoute";
import UnauthorizedPage from "./Pages/UnAuthorizedPage";
import VerificationPage from "./Pages/VerificationPage";
import RequestForgetpassword from "./Pages/RequestForgetpassword";
import ResetWithToken from "./Pages/ResetWithtoken";

function App() {
  return (
    <div className="w-screen h-screen bg-white flex flex-col items-center">
     
  

<Routes>
<Route path="/login" element={<LoginPage/>} />
<Route path="/register" element={<RegisterPage/>} />
<Route path="/verify" element={<VerificationPage/>}/>
<Route path="/resetpassword" element={<ResetWithToken/>} />
<Route path="/forgetpassword" element={<RequestForgetpassword/>} />


<Route element={<PrivateRoute allowedRoles={["Doner"]} />} >
<Route path="/" element={<HeaderCombine element={<DonerDashboard />}/>} />
<Route path="/profile" element={<HeaderCombine element={<Profile/>}/>} />
</Route>
<Route element={<PrivateRoute allowedRoles={["Hospital"]} />} >
 <Route path="/hospital-profile" element={<HeaderCombine element={<HospitalProfilePage/>}/>} />

  <Route path="/hospital-dashboard" element={<HeaderCombine element={<HospitalDashboard/>} />}/>
  <Route path="/hospital-bloodRequests" element={<HeaderCombine element={<HospitalBloodRequest/>} />}/>

 </Route>
 <Route element={<PrivateRoute allowedRoles={["Admin"]} />} >
  <Route path="/Admin-dashboard" element={<HeaderCombine element={<AdminDashboard/>} />}/>
  <Route path="/admin-hospital" element={<HeaderCombine element={<AdminHospital/>} />}/>
  <Route path="/admin-doner" element={<HeaderCombine element={<AdminDoner/>} />}/>
  <Route path="/admin-schedules" element={<HeaderCombine element={<SchedulesPage/>} />}/>
  <Route path="/admin-bloodRequest" element={<HeaderCombine element={<AdminBloodRequest/>} />}/>


</Route>
<Route path="/unauthorized" element={<UnauthorizedPage/>} />
<Route path="*" element={<h1>Not Found</h1>} />
</Routes>
      
    </div>
  );
}

export default App;

