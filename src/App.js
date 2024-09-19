import './App.css';
import { Route, Switch } from 'react-router-dom/cjs/react-router-dom.min';
import 'react-toastify/dist/ReactToastify.css';
import { AfterLogin, PrivateRoute, useCancelPrePageApi } from './globals/utils';
import LoginForm from './screens/login/LoginForm';
import HomePanel from './screens/home/HomePanel';
import MovieDetails from './screens/movieDetails/MovieDetails';

function App() {
  return (
    <Switch>
      <Route path="/login" component={LoginForm} />
      <PrivateRoute path="/home" component={HomePanel} />
      <PrivateRoute path="/movie/:movieId" component={MovieDetails} />
      <Route path="/" component={AfterLogin} />
    </Switch>
  );
}

export default App;
