// "https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=0&longitude=0"

import { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css"; 

import Message from "./Message";
import styles from "./Form.module.css";
import Button from "./Button";
import BackButton from "./BackButton";
import { useUrlPosition } from '../hooks/useUrlPosition';
import Spinner from "./Spinner";
import { useCities } from "../contexts/CitiesContext";
import { useNavigate } from "react-router-dom";

export function convertToEmoji(countryCode) {
  const codePoints = countryCode
    .toUpperCase()
    .split("")
    .map((char) => 127397 + char.charCodeAt());
  return String.fromCodePoint(...codePoints);
}

function Form() {
  const [lat, lng] = useUrlPosition();

  const navigate = useNavigate();
  const [isLoadingGeocoding, setIsLoadingGeocoding] = useState(false);
  const [cityName, setCityName] = useState("");
  const [country, setCountry] = useState("");
  const [date, setDate] = useState(new Date());
  const [notes, setNotes] = useState("");
  const [emoji, setEmoji] = useState("");
  const [geocodingError, setGeocodingError] = useState("");
  const { postNewCity, isLoading } = useCities();

  useEffect(function(){
    if(!lat && !lng) return;

    const controller = new AbortController();
    (async function(){
      try{
        setIsLoadingGeocoding(true);
        setGeocodingError("");
        const response = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}`, {signal:controller.signal});
        const data = await response.json();
        
              if(!data.countryCode) 
                   throw new Error("That doesn't seem to be acity, click somwhere else please 😉");
        
      setCityName(data.city || data.locality || "");
      setCountry(data.countryName);
      setEmoji(convertToEmoji(data.countryCode));

      } catch(err){
        if(err.name !== "AbortError"){
          console.error(err);
          setGeocodingError(err.message);
        }
      } finally {
        setIsLoadingGeocoding(false);
      }
    })()

    return function (){
      controller.abort()
    }
  }, [lat, lng]);

  async function handleSubmit(e){
    e.preventDefault();

    if(!cityName && !date) return;

    const newCity = {
      cityName, 
      country,
      emoji, 
      date, 
      notes, 
      position: {lat, lng}
    }

    await postNewCity(newCity);
    navigate("/app");
  }

  if(isLoadingGeocoding) return <Spinner /> 
  
  if(!lat && !lng) return <Message message = "Start by clicking somewhere on the map 🗺️"/> 

  if(geocodingError) return <Message message = {geocodingError} />

  return (
    <form className={`${styles.form} ${isLoading ? styles.loading : ""}`} onSubmit={handleSubmit}>
      <div className={styles.row}>
        <label htmlFor="cityName">City name</label>
        <input
          id="cityName"
          onChange={(e) => setCityName(e.target.value)}
          value={cityName}
        />
        <span className={styles.flag}>{emoji}</span>
      </div>

      <div className={styles.row}>
        <label htmlFor="date">When did you go to {cityName}?</label>
        {/* <input
          id="date"
          onChange={(e) => setDate(e.target.value)}
          value={date} 
  />*/}
         <DatePicker id = "date" onChange = {date => setDate(date)} selected={date} dateFormat="dd/MM/yyy"/>
      </div>

      <div className={styles.row}>
        <label htmlFor="notes">Notes about your trip to {cityName}</label>
        <textarea
          id="notes"
          onChange={(e) => setNotes(e.target.value)}
          value={notes}
        />
      </div>

      <div className={styles.buttons}>
        <Button type = "primary">Add</Button>
        <BackButton /> 
      </div>
    </form>
  );
}

export default Form;
