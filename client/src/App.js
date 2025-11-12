import './App.css';
import UserRoleSelector from './components/UserRoleSelector';
import { useUserContext } from './context/UserContext';
import { useShoppingListsContext } from './context/ShoppingListsContext';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Detail from './routes/Detail';
import ShoppingLists from './routes/ShoppingLists';

function App() {
  const { currentUser, users, authenticate } = useUserContext();
  const { shoppingLists } = useShoppingListsContext();

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
            <UserRoleSelector
              users={users}
              authenticate={authenticate}
            />
          </div>
        </div>

        <Routes>
          <Route path="/list" element={<ShoppingLists />} />
          <Route path="/detail/:id" element={
            <Detail
              currentUser={currentUser}
              users={users}
              shoppingLists={shoppingLists}
            />
          }
          />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
