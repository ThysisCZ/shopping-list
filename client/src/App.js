import './App.css';
import './index.css';
import UserRoleSelector from './components/UserRoleSelector';
import LanguageSelector from './components/LanguageSelector';
import { useUserContext } from './context/UserContext';
import { useShoppingListsContext } from './context/ShoppingListsContext';
import { useModeContext } from './context/ModeContext';
import { useLanguageContext } from './context/LanguageContext';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Detail from './routes/Detail';
import ShoppingLists from './routes/ShoppingLists';
import Icon from '@mdi/react';
import { mdiThemeLightDark } from '@mdi/js';
import { Button } from 'react-bootstrap';
import setBodyColor from './setBodyColor';

function App() {
  const { currentUser, users, authenticate } = useUserContext();
  const { shoppingLists } = useShoppingListsContext();
  const { mode, setMode } = useModeContext();
  const { languages, currentLanguage, setCurrentLanguage } = useLanguageContext();

  const handleModeChange = () => {
    if (mode === "light") {
      setMode("dark");
    } else {
      setMode("light");
    }
  }

  const handleLanguageChange = (id) => {
    const languageData = languages.find(language => language.id === id);

    if (languageData) {
      setCurrentLanguage(languageData);
    }
  }

  setBodyColor({ color: mode === "light" ? "white" : "#212121" });

  return (
    <>
      <BrowserRouter>
        <div style={{ backgroundColor: mode === "light" ? "white" : "#212121" }}>
          <div className="Top-panel-container" style={{ color: mode === "light" ? "black" : "white" }}>
            <div className="User-container">
              <div>
                <b>{currentLanguage.id === "EN" ? "Current user" : "Aktuální uživatel"}:</b>
              </div>
              <div>
                <UserRoleSelector
                  users={users}
                  authenticate={authenticate}
                  style={{
                    backgroundColor: mode === "light" ? "white" : "#212121"
                  }}
                />
              </div>
            </div>
            <div className="Settings-container">
              <div className="Settings" style={{ maxWidth: 190 }}>
                {currentLanguage.id === "EN" ? "Language" : "Jazyk"}:
                <LanguageSelector
                  languages={languages}
                  setLanguage={handleLanguageChange}
                />
              </div>
              <div className="Settings">
                {currentLanguage.id === "EN" ? "Mode" : "Režim"}:
                <Button onClick={handleModeChange} style={{ display: "flex", alignItems: "center" }} variant="info" >
                  <Icon path={mdiThemeLightDark} size={1} color={mode === "light" ? "white" : "black"} />
                </Button>
              </div>
            </div>
          </div>

          <Routes>
            <Route path="/" element={<Navigate to="/list" />} />
            <Route path="/list" element={<ShoppingLists />} />
            <Route path="/detail/:id" element={
              <Detail
                currentUser={currentUser}
                users={users}
                shoppingLists={shoppingLists}
              />
            }
            />
            <Route path="*" element={<Navigate to="/list" />} />
          </Routes>
        </div>
      </BrowserRouter>
    </>
  );
}

export default App;
