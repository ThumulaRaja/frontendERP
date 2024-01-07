
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



import "./assets/styles/main.css";
import "./assets/styles/responsive.css";
import CashDashboard from "./pages/Transaction/CashDashboard/CashDashboard";


function App() {
  return (

    <div className="App">
      <Switch>
        <Route path="/" exact component={Login} />
        {/*<Route path="/sign-up" exact component={SignUp} />*/}
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
          <Route exact path="/bank" component={Bank} />
          <Route exact path="/profile" component={Profile} />
          <Redirect from="*" to="/dashboard" />
        </Main>
      </Switch>
    </div>

  );
}

export default App;
