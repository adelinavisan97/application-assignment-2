import {useState, useEffect} from 'react';
import CalendarComponent from './calendar';
import React from 'react';


const API_BASE = "http://localhost:3001";

function App() {
    const [people, setPeople] = useState([]);
    const [popupActive, setPopupActive] = useState(false);
    const [newPerson, setNewPerson] = useState("");
    const [newEmail, setNewEmail] = useState("");

    useEffect(() => {
        getpeople()
        // console.log(people);
    }, [people])
    const getpeople = () => {
        fetch(API_BASE + "/people")
            .then(res => res.json())
            .then(data => setPeople(data))
            .catch(err => console.error("ERROR: ", err))
    }

    
    const deletePerson = async id => {
        const data = await fetch(API_BASE + "/entry/delete/" + id, {method: "DELETE"})
            .then(res => res.json());

        setPeople(people => people.filter(person => person._id !== data._id));
    }

    const addPerson = async () => {
        const data = await fetch(API_BASE + "/new-entry", {
            method:"POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                name: newPerson,
                email: newEmail
            })
        }).then(res => res.json())

        setPeople([...people, data]);
        setPopupActive(false);
        setNewPerson("");
        setNewEmail("");
    }

    return (
        <div className="App">
            <h1>Welcome</h1>
            <h4>Availability Calculator</h4>
            <div><CalendarComponent /></div>
            <div className="people"><h4>Staff contact details</h4>
                {people.map(person => (
                    <div className={"person " + (person.availability ? "is-complete" : "")} key={person._id}>
                        <div className="name">{person.name} -&nbsp;</div>
                        <div className="name">{person.email}</div>
                        <div className="delete-person" onClick={() => deletePerson(person._id)}>x</div>
                    </div>
                ))}
            </div>
            <div className="addPopup" onClick={() => setPopupActive(true)}>+</div>

            {popupActive ? (
                <div className="popup">
                    <div className="closePopup" onClick={() => setPopupActive(false)}>x</div>
                    <div className="content">
                        <h3>Add person</h3>
                        <input type="text" className="add-person-input" onChange={e => setNewPerson(e.target.value)} value={newPerson} placeholder="Name" />
                        <input type="text" className="add-person-input" onChange={e => setNewEmail(e.target.value)} value={newEmail} placeholder="Email" />
                        <div className="button" onClick={addPerson}>Add person</div>
                    </div>
                </div>
            ) : ''}
        
        </div>
    );
}

export default App;
