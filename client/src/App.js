// Importing dependencies
import {useState, useEffect} from 'react';
import CalendarComponent from './calendar';
import React from 'react';

// Set the API base URL
const API_BASE = "http://localhost:3001";

function App() {
    // Define state variables
    const [people, setPeople] = useState([]);
    const [popupActive, setPopupActive] = useState(false);
    const [newPerson, setNewPerson] = useState("");
    const [newEmail, setNewEmail] = useState("");

    // Fetch people data from API on component mount or when 'people' state changes
    useEffect(() => {
        getpeople()
    }, [people])

    // Function to fetch people data from API and update 'people' state
    const getpeople = () => {
        fetch(API_BASE + "/people")
            .then(res => res.json())
            .then(data => setPeople(data))
            .catch(err => console.error("ERROR: ", err))
    }
    
    // Function to delete a person from the API and update 'people' state
    const deletePerson = async id => {
        const data = await fetch(API_BASE + "/entry/delete/" + id, {method: "DELETE"})
            .then(res => res.json());

        setPeople(people => people.filter(person => person._id !== data._id));
    }

    // Function to add a new person to the API and update 'people' state
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

    // Render the component
    return (
        <div className="App">
            <h1>Welcome</h1>
            <h4>Team Calendar</h4>
            <div><CalendarComponent /></div>
            <div className="people"><h4>Staff contact details</h4>
                {/* Map over 'people' state to display each person */}
                {people.map(person => (
                    <div className={"person " + (person.availability ? "is-complete" : "")} key={person._id}>
                        <div className="name">{person.name} -&nbsp;</div>
                        <div className="name">{person.email}</div>
                        <div className="delete-person" onClick={() => deletePerson(person._id)}>x</div>
                    </div>
                ))}
            </div>
            {/* Add button to open popup for adding a new person */}
            <div className="addPopup" onClick={() => setPopupActive(true)}>+</div>

            {/* If 'popupActive' state is true, display the add person popup */}
            {popupActive ? (
                <div className="popup">
                    <div className="closePopup" onClick={() => setPopupActive(false)}>x</div>
                    <div className="content">
                        <h3>Add person</h3>
                        <input type="text" className="add-person-input" onChange={e => setNewPerson(e.target.value)} value={newPerson} placeholder="Name" />
                        <input type="email" className="add-person-input" onChange={e => setNewEmail(e.target.value)} value={newEmail} placeholder="Email" />
                        <div className="button" onClick={addPerson}>Add person</div>
                    </div>
                </div>
            ) : ''}
        
        </div>
    );
}

export default App;
