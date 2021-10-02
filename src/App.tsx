import { BrowserRouter, Route, Switch } from "react-router-dom";
import { AuthContextProvider } from "./context/AuthContext";
import { DisplaySpanProvider } from "./context/DisplaySpanContext";
import { AdminRoom } from "./pages/AdminRoom";
import { Home } from "./pages/Home/index";
import { NewRoom } from "./pages/NewRoom/index";
import { Room } from "./pages/Room/index";

function App() {
 

  return (
    <BrowserRouter>
        <AuthContextProvider>
          <DisplaySpanProvider>
          <Switch>
            <Route path="/" exact component={Home}/>
            <Route path="/rooms/new" component={NewRoom}/>
            <Route path="/rooms/:id" component={Room}/>
            <Route path="/admin/rooms/:id" component={AdminRoom}/>
          </Switch>
          </DisplaySpanProvider>
        </AuthContextProvider>
    </BrowserRouter>
  );
}

export default App;
