import './App.css';
import UserRoleSelector from './components/UserRoleSelector';
import { useUserContext } from './context/UserContext';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Detail from './routes/Detail';

function App() {
  const { currentUser } = useUserContext();

  return (
    <>
      <BrowserRouter>
        <div className="Role-container">
          <div>
            <div>
              <b>Current user: </b> {currentUser.name}
            </div>
          </div>
          <div>
            <UserRoleSelector />
          </div>
        </div>

        <Routes>
          <Route path="/detail" element={<Detail />}></Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
