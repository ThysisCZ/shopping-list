import Form from 'react-bootstrap/Form';

function LanguageSelector({ languages, setLanguage }) {

    return (
        <Form.Select onChange={(e) => setLanguage(e.target.value)}>
            {languages.map(language => (
                <option key={language.id} value={language.id}>
                    {language.name}
                </option>
            ))}
        </Form.Select>
    )
}

export default LanguageSelector;