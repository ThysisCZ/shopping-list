import { CartesianGrid, Line, LineChart, XAxis, YAxis, Tooltip } from 'recharts';
import { Row, Col } from 'react-bootstrap';
import { useLanguageContext } from '../context/LanguageContext';

function ShoppingListChart({ userLists }) {
    const { currentLanguage } = useLanguageContext();

    return (
        userLists?.length !== 0 ?
            <LineChart className="Lists-stats" responsive data={userLists}
                margin={{ top: 35, right: 65, left: 65, bottom: 95 }}>
                <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
                <XAxis dataKey="title" angle={-35} textAnchor="end" label={{ value: currentLanguage.id === "EN" ? "Shopping Lists" : "Nákupní seznamy", position: "bottom", offset: 65 }} />
                <YAxis width="auto" label={{ value: currentLanguage.id === "EN" ? "Item Count" : "Počet položek", angle: -90, position: "left" }} />
                <Tooltip />
                <Line type="monotone" dataKey="items.length" name={currentLanguage.id === "EN" ? "Item Count" : "Počet položek"} stroke="#8884d8" />
            </LineChart> :
            <Row>
                <Col className="text-center mt-4">
                    <p style={{ marginBottom: 25 }}>
                        {currentLanguage.id === "EN" ? "No data to view." : "Žádná data k zobrazení."}
                    </p>
                </Col>
            </Row>
    );
}

export default ShoppingListChart;