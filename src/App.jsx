import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import { CitiesProvider } from "./contexts/CitiesContext";
import Homepage from "./pages/Homepage";
import Product from "./pages/Product";
import Pricing from "./pages/Pricing";
import Login from "./pages/Login";
import PageNotFound from "./pages/PageNotFound";
import AppLayout from "./pages/AppLayout";
import CityList from "./components/CityList";
import CountryList from "./components/CountryList";
import City from "./components/City";
import Form from "./components/Form";
import { AuthProvider } from "./contexts/FakeAuthContext";
import ProtectedRoute from "./pages/ProtectedRoute";

function App() {


  return (   
      <AuthProvider>
        <CitiesProvider>
          <BrowserRouter>
            <Routes>
                <Route index element = {<Homepage /> } />
                <Route path = "product" element = {<Product />} />
                <Route path = "pricing" element = {<Pricing />} />
                <Route path = "login" element = {<Login />} />
                <Route path = "app" element = {<ProtectedRoute><AppLayout /></ProtectedRoute>}>
                  {/* replace the current element in the stack, 'cause otherwise we won't be able to get back to the previous page */}
                  <Route index element = {<Navigate replace to = "cities"/>} /> 
                  <Route path = "cities" element = {<CityList /> } /> 
                  <Route path = "cities/:id" element = {<City />} /> 
                  <Route path = "countries" element = {<CountryList />} /> 
                  <Route path = "form" element = {<Form />} /> 
                </Route>
                <Route path="*" element = {<PageNotFound /> } /> 
            </Routes>
          </BrowserRouter>
        </CitiesProvider>
      </AuthProvider>
  )
}

export default App;