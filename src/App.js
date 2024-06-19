import { Route, Routes } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import Loading from "./Loading.js"
import { ProtectedRoute } from './ProtectedRoute';
import Settlements from './settlements'
import Subscriptions from './subscriptions'
import Dashboard from './dashboard'
import Settings from './settings.js'
import NotFoundPage from "./PageNotFound.js";
import IntermediateScreen from "./IntermediateScreen.js";
import User from "./user.js";
import Order from "./order.js";
import Settlement from "./settlement.js";

function App() {

  const { isLoading } = useAuth0();

  if (isLoading) {
    return <Loading />;
  }

  return (
    <Routes>
      <Route path="/settings" element={
        <ProtectedRoute component={Settings} />
      } />      
      <Route path="/settlements" element={
        <ProtectedRoute component={Settlements} />
      } />      
      <Route path="/subscriptions" element={
        <ProtectedRoute component={Subscriptions} />
      } />    
      <Route path="/user/:user_id" element={
        <ProtectedRoute component={User} />
      } />      
      <Route path="/order/:order_id" element={
        <ProtectedRoute component={Order} />
      } />
      <Route path="/settlement/:payment_id" element={
        <ProtectedRoute component={Settlement} />
      } />
      <Route path="/IntermediateScreen" element={<IntermediateScreen />} />
      <Route path="/" element={
        <ProtectedRoute component={Dashboard} />
      } />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default App;
