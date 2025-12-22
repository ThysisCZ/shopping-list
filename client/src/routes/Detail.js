import { useParams } from 'react-router-dom';
import ListHeader from '../components/ListHeader';
import MemberList from '../components/MemberList';
import ItemList from '../components/ItemList';
import ResolvedStateChart from '../components/ResolvedStateChart';
import { useShoppingListsContext } from '../context/ShoppingListsContext';
import { useModeContext } from '../context/ModeContext';
import { useLanguageContext } from '../context/LanguageContext';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Stack } from 'react-bootstrap';
import Icon from '@mdi/react';
import { mdiArrowLeft } from '@mdi/js';

function Detail({ currentUser, users, shoppingLists }) {
    const { id } = useParams();
    const { getListById } = useShoppingListsContext();
    const { mode } = useModeContext();
    const { currentLanguage } = useLanguageContext();
    const [shoppingList, setShoppingList] = useState(null);
    const [shoppingListCall, setShoppingListCall] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const load = async () => {
            setShoppingListCall({ state: "pending" });

            try {
                const data = await getListById(id);

                if (data) {
                    setShoppingList(data);
                    setShoppingListCall({ state: "success", data });
                } else {
                    setShoppingListCall({ state: "error", error: "Failed to load shopping list." });
                }
            } catch (e) {
                setShoppingListCall({ state: "error", error: e.message });
            }
        }

        load();
    }, [id, getListById]);

    if (shoppingListCall?.state === "error") {
        return (
            <div style={{ color: mode === "light" ? "black" : "white" }}>
                <h1 style={{ textAlign: 'center', fontWeight: 'bold' }}>{currentLanguage.id === "EN" ? "404 - Not Found" : "404 - Nenalezeno"}</h1>
                <h3 style={{ textAlign: 'center' }}>{currentLanguage.id === "EN" ? "Shopping list not found." : "Seznam nebyl nalezen."}</h3>
            </div>
        );
    }

    const isAuthorized = shoppingList && shoppingList.memberIds?.includes(currentUser.id);

    return (
        <div style={{ marginLeft: 15, marginRight: 15 }}>
            {isAuthorized ? (
                <>
                    <Button style={{ marginLeft: 30, display: "flex", alignItems: "center" }} onClick={() => navigate("/list")}>
                        <Stack direction="horizontal" gap={1}>
                            <Icon path={mdiArrowLeft} size={1} /> {currentLanguage.id === "EN" ? "Back" : "Zpět"}
                        </Stack>
                    </Button>
                    <ListHeader
                        currentUser={currentUser}
                        users={users}
                        shoppingList={shoppingList}
                        setShoppingList={setShoppingList}
                        shoppingLists={shoppingLists}
                    />
                    <MemberList
                        currentUser={currentUser}
                        users={users}
                        shoppingList={shoppingList}
                        setShoppingList={setShoppingList}
                    />
                    <ItemList
                        shoppingList={shoppingList}
                        setShoppingList={setShoppingList}
                    />
                    <ResolvedStateChart
                        shoppingList={shoppingList}
                    />
                </>
            ) : (
                shoppingListCall?.state !== "pending" && <div style={{ color: mode === "light" ? "black" : "white" }}>
                    <h1 style={{ textAlign: 'center', fontWeight: 'bold' }}>{currentLanguage.id === "EN" ? "401 - Unauthorized" : "401 - Neautorizováno"}</h1>
                    <h3 style={{ textAlign: 'center' }}>{currentLanguage.id === "EN" ? "You don't have permission to view this list." : "K zobrazení tohoto seznamu nemáte dostatečné oprávnění."}</h3>
                </div>
            )}
        </div>
    )
}

export default Detail;