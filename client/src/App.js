import {useState, useEffect} from 'react';
import CalendarComponent from './calendar';
import React from 'react';

const API_BASE = "http://localhost:3001";

function App() {
    const [devs, setDevs] = useState([]);
    const [popupActive, setPopupActive] = useState(false);
    const [newDev, setNewDev] = useState("");

    useEffect(() => {
        getDevs()
        console.log(devs);
    }, [devs])
    const getDevs = () => {
        fetch(API_BASE + "/availability")
            .then(res => res.json())
            .then(data => setDevs(data))
            .catch(err => console.error("ERROR: ", err))
    }
    const changeAvailability = async id => {
        const data = await fetch(API_BASE + "/availability/true/" + id)
            .then(res => res.json());

        setDevs(devs => devs.map(dev => {
            if (dev._id === data._id) {
                dev.availability = data.availability;
            }
            return dev;
        }));
    }

    const deleteDev = async id => {
        const data = await fetch(API_BASE + "/entry/delete/" + id, {method: "DELETE"})
            .then(res => res.json());

        setDevs(devs => devs.filter(dev => dev._id !== data._id));
    }

    const addDev = async () => {
        const data = await fetch(API_BASE + "/new-entry", {
            method:"POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                name: newDev
            })
        }).then(res => res.json())

        setDevs([...devs, data]);
        setPopupActive(false);
        setNewDev("")
    }

	return (
		<div className="App">
            <h1>Welcome</h1>
            <h4>Availability Calculator</h4>
            <div><CalendarComponent /></div>
            <div className="devs">
                {devs.map(dev => (
                    <div className={"dev " + (dev.availability ? "is-complete" : "")} key={dev._id}>
                        <div className="checkbox" onClick={() => changeAvailability(dev._id)}></div>
                        <div className="name">{dev.name}</div>
                        <div className="delete-person" onClick={() => deleteDev(dev._id)}>x</div>
                    </div>
                ))}
            </div>
            <div className="addPopup" onClick={() => setPopupActive(true)}>+</div>

            {popupActive ? (
                <div className="popup">
                    <div className="closePopup" onClick={() => setPopupActive(false)}>x</div>
                    <div className="content">
                        <h3>Add person</h3>
                        {newDev}
                        <input type="text" className="add-dev-input" onChange={e => setNewDev(e.target.value)} value={newDev}/>
                        <div className="button" onClick={addDev}>Add person</div>
                    </div>
                </div>
            ) : ''}
        
		</div>
	);
}

export default App;
