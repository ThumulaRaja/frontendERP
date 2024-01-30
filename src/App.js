import React, { useEffect } from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import Home from "./pages/Home";
import Customers from "./pages/Customers/Customers";
import Profile from "./pages/Profile";
import SignUp from "./pages/SignUp";
import Main from "./components/layout/Main";
import Login from "./pages/login/LoginPage";
import AddItemsForm from "./pages/Inventory/AddItemsForm/AddItemsForm";
import Rough from "./pages/Inventory/Rough/Rough";
import Lots from "./pages/Inventory/Lots/Lots";
import SortedLots from "./pages/Inventory/Sorted Lots/Sorted Lots";
import CP from "./pages/Inventory/CP/CP";
import AddTransactionForm from "./pages/Transaction/AddTransactionForm/AddTransactionForm";
import AddPaymentsForm from "./pages/Transaction/AddPaymentsForm/AddPaymentsForm";
import Expenses from "./pages/Transaction/Expenses/Expenses";
import CashFlows from "./pages/Transaction/CashFlows/CashFlows";
import Bank from "./pages/Transaction/Bank/Bank";
import HT from "./pages/Operations/HeatTreatmentGroup/HT";
import HeatT from "./pages/Operations/HeatTreatment/HeatT";
import CutPolish from "./pages/Operations/CutPolish/CutPolish";
import CashDashboard from "./pages/Transaction/CashDashboard/CashDashboard";
import ItemURL from "./pages/GlobalViewModels/ItemURL";
import Cookies from "js-cookie";

import "./assets/styles/main.css";
import "./assets/styles/responsive.css";
import Buying from "./pages/Transaction/Buying/Buying";
import Selling from "./pages/Transaction/Selling/Selling";
import CashBook from "./pages/Transaction/CashBook/CashBook";

function App() {
  const rememberedUser = Cookies.get("rememberedUser");
  const is_cookie_set = Boolean(rememberedUser);

  useEffect(() => {
    if (!is_cookie_set) {
      // Check if the current path is already '/'
      const currentPath = window.location.pathname;

      // Define an array of paths that should not redirect
      const allowedPaths = [
        '/'
      ];

      // Check if the current path is in the allowed paths or has a dynamic :code part
      if (!allowedPaths.includes(currentPath) && !currentPath.match(/^\/(rough|lots|sorted-lots|c-p)\/[^/]+$/)) {
        // If not, redirect to '/'
        window.location.href = "/";
      }
    }
  }, [is_cookie_set]);


  return (
      <div className="App">
        <Switch>
          <Route path="/" exact component={Login} />
          {!is_cookie_set && (
              <>
                <Route exact path="/sorted-lots/:code" component={ItemURL} />
                <Route exact path="/c-p/:code" component={ItemURL} />
                <Route exact path="/lots/:code" component={ItemURL} />
                <Route exact path="/rough/:code" component={ItemURL} />
              </>
          )}
          <Main>
            <Route exact path="/dashboard" component={Home} />
            <Route exact path="/sign-up" component={SignUp} />
            <Route exact path="/customers" component={Customers} />
            <Route exact path="/heat-treatment-group" component={HT} />
            <Route exact path="/heat-treatment" component={HeatT} />
            <Route exact path="/c-and-p" component={CutPolish} />
            <Route exact path="/add-items" component={AddItemsForm} />
            <Route exact path="/rough" component={Rough} />
            <Route exact path="/lots" component={Lots} />
            <Route exact path="/sorted-lots" component={SortedLots} />
            <Route exact path="/c-p" component={CP} />
            <Route exact path="/add-transation" component={AddTransactionForm} />
            <Route exact path="/add-payments" component={AddPaymentsForm} />
            <Route exact path="/expenses" component={Expenses} />
            <Route exact path="/cash-flows" component={CashFlows} />
            <Route exact path="/cash-dashboard" component={CashDashboard} />
            <Route exact path="/buying" component={Buying} />
            <Route exact path="/selling" component={Selling} />
            <Route exact path="/cash-book" component={CashBook} />
            <Route exact path="/bank" component={Bank} />
            <Route exact path="/profile" component={Profile} />
            {is_cookie_set && (
                <>
                  <Route exact path="/rough/:code" component={Rough} />
                  <Route exact path="/lots/:code" component={Lots} />
                  <Route exact path="/sorted-lots/:code" component={SortedLots} />
                  <Route exact path="/c-p/:code" component={CP} />
                </>
            )}

            {/*<Redirect from="*" to="/dashboard" />*/}
          </Main>
        </Switch>
      </div>
  );
}

export default App;
