import Map, { Marker, Popup } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { Room, Star } from "@material-ui/icons";
import "./app.css";
import { useState, useEffect } from "react";
import { format } from "timeago.js";
import mapService from "./services/mapService";
import Register from "./components/Register/Register";
import Login from "./components/Login/Login";

function App() {
  const myStorage = window.localStorage;
  const [currentUser, setCurrentUser] = useState(myStorage.getItem("user"));
  const [viewport, setViewport] = useState({
    latitude: 37.8,
    longitude: -121.7,
    zoom: 9,
  });
  const [pins, setPins] = useState([]);
  const [currentPlaceId, setCurrentPlaceId] = useState(null);
  const [newPlace, setNewPlace] = useState(null);

  const [title, setTitle] = useState(null);
  const [desc, setDesc] = useState(null);
  const [rating, setRating] = useState(0);

  const [showRegister, setShowRegister] = useState(false);
  const [showLogin, setShowLogin] = useState(false);

  useEffect(() => {
    const getPins = async () => {
      try {
        const res = await mapService.getPins();
        setPins(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    getPins();
  }, []);

  const handleMarkerClick = (id, lat, lng) => {
    setCurrentPlaceId(id);
    setViewport({
      latitude: lat,
      longitude: lng,
    });
  };

  const handleAddClick = (e) => {
    e.preventDefault();
    const { lng, lat } = e.lngLat;
    setNewPlace({
      lng,
      lat,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newPin = {
      username: currentUser,
      title,
      desc,
      rating,
      lat: newPlace.lat,
      lng: newPlace.lng,
    };

    try {
      const res = await mapService.addPin(newPin);
      setPins([...pins, res.data]);
      setNewPlace(null);
    } catch (error) {
      console.log(error);
    }
  };

  const handleLogout = () => {
    myStorage.removeItem("user");
    setCurrentUser(null);
  };

  return (
    <div className="App">
      <Map
        {...viewport}
        onMove={(e) => setViewport(e.viewState)}
        style={{ width: "100vw", height: "100vh" }}
        mapStyle="mapbox://styles/mapbox/streets-v9"
        // mapStyle="mapbox://styles/scobedo/cl1nrdf3m000414p6q22y4k92"
        mapboxAccessToken={import.meta.env.VITE_MAPBOX_TOKEN}
        onDblClick={handleAddClick}
      >
        {pins.map((pin) => (
          <div key={pin._id}>
            <Marker longitude={pin.lng} latitude={pin.lat} anchor="bottom">
              <Room
                style={{
                  fontSize: 32,
                  color: pin.username === currentUser ? "slateblue" : "#ff2626",
                  cursor: "pointer",
                }}
                onClick={() => handleMarkerClick(pin._id, pin.lat, pin.lng)}
              />
            </Marker>
            {pin._id === currentPlaceId && (
              <Popup
                longitude={pin.lng}
                latitude={pin.lat}
                anchor="left"
                closeButton={true}
                closeOnClick={false}
                onClose={() => setCurrentPlaceId(null)}
              >
                <div className="card">
                  <label>Place</label>
                  <h3 className="place">{pin.title}</h3>
                  <label>Review</label>
                  <p className="desc">{pin.desc}</p>
                  <label>Rating</label>
                  <div className="stars-icon">
                    {Array(pin.rating)
                      .fill()
                      .map((_, i) => (
                        <Star key={i} />
                      ))}
                  </div>
                  <label>Information</label>
                  <span className="username">
                    Created by <b>{pin.username}</b>
                  </span>
                  <span className="date">{format(pin.createdAt)}</span>
                </div>
              </Popup>
            )}
          </div>
        ))}
        {newPlace && (
          <Popup
            longitude={newPlace.lng}
            latitude={newPlace.lat}
            anchor="left"
            closeButton={true}
            closeOnClick={false}
            onClose={() => setNewPlace(null)}
          >
            <div>
              <form onSubmit={handleSubmit}>
                <label>Place</label>
                <input
                  placeholder="Enter a Title"
                  onChange={(e) => setTitle(e.target.value)}
                />
                <label>Review</label>
                <textarea
                  placeholder="Say us something about this place."
                  onChange={(e) => setDesc(e.target.value)}
                />
                <label>Rating</label>
                <select onChange={(e) => setRating(e.target.value)}>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="5">5</option>
                </select>
                <button className="btn-submit" type="submit">
                  Add Pin
                </button>
              </form>
            </div>
          </Popup>
        )}
      </Map>
      {currentUser ? (
        <div className="wrapper-button">
          <button className="button logout" onClick={handleLogout}>
            Logout
          </button>
        </div>
      ) : (
        <div className="wrapper-button">
          <button className="button login" onClick={() => setShowLogin(true)}>
            Login
          </button>
          <button
            className="button register"
            onClick={() => setShowRegister(true)}
          >
            Register
          </button>
        </div>
      )}
      {showRegister && <Register setShowRegister={setShowRegister} />}
      {showLogin && (
        <Login
          setShowLogin={setShowLogin}
          myStorage={myStorage}
          setCurrentUser={setCurrentUser}
        />
      )}
    </div>
  );
}

export default App;
