import React, { useState, useEffect } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { getMe } from '../utils/API';
import Auth from "../utils/auth";
import { formatDate } from '../utils/dateFormat';
import Header from "../components/Header";
import cardioIcon from "../assets/images/cardio.png";
import resistanceIcon from "../assets/images/resistance.png";

export default function History() {
  const [exerciseData, setExerciseData] = useState([]);
  const [displayedItems, setDisplayedItems] = useState(6);
  const [currentDate, setCurrentDate] = useState('');

  const loggedIn = Auth.loggedIn();

  useEffect(() => {
    const getUserData = async () => {
      try {
        const token = loggedIn ? Auth.getToken() : null;
        if (!token) return;

        const response = await getMe(token);

        if (!response.ok) {
          throw new Error("Something went wrong!");
        }

        const user = await response.json();

        if (user.cardio && user.resistance) {
          const exercise = [...user.cardio, ...user.resistance];

          exercise.sort((a, b) => new Date(b.date) - new Date(a.date));

          exercise.forEach(item => {
            item.date = formatDate(item.date);
          });

          setExerciseData(exercise);
        }
      } catch (err) {
        console.error(err);
        // Optionally show an error message to the user
      }
    };

    getUserData();
  }, [loggedIn]);

  function showMoreItems() {
    setDisplayedItems(displayedItems + 6);
  }

  if (!loggedIn) {
    return <Navigate to="/login" />;
  }

  return (
    <div className='history'>
      <Header />
      <div className="d-flex flex-column align-items-center">
        <h2 className='title'>History</h2>
        {exerciseData.length > 0 ? (
          <div className='history-data'>
            {exerciseData.slice(0, displayedItems).map((exercise) => {
              let dateToDisplay;
              if (exercise.date !== currentDate) {
                setCurrentDate(exercise.date);
                dateToDisplay = exercise.date;
              } else {
                dateToDisplay = '';
              }

              return (
                <div className='history-div d-flex' key={exercise._id}>
                  {dateToDisplay && (
                    <div className='date d-flex align-items-center'>{dateToDisplay}</div>
                  )}
                  <Link className='text-decoration-none' to={`/history/${exercise.type}/${exercise._id}`}>
                    {exercise.type === "cardio" ? (
                      <div className="history-card cardio-title d-flex">
                        <div className='d-flex align-items-center'>
                          <img alt="cardio" src={cardioIcon} className="history-icon" />
                        </div>
                        <div>
                          <p className='history-name'>{exercise.name}</p>
                          <p className='history-index'>{exercise.distance} miles</p>
                        </div>
                      </div>
                    ) : (
                      <div className="history-card resistance-title d-flex">
                        <div className='d-flex align-items-center'>
                          <img alt="resistance" src={resistanceIcon} className="history-icon" />
                        </div>
                        <div>
                          <p className='history-name'>{exercise.name}</p>
                          <p className='history-index'>{exercise.weight} pounds</p>
                        </div>
                      </div>
                    )}
                  </Link>
                </div>
              );
            })}
            {exerciseData.length > displayedItems && (
              <div className='d-flex justify-content-center'>
                <button
                  className='show-btn'
                  onClick={showMoreItems}
                  aria-label="Show more exercises"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#000000" strokeWidth="2" strokeLinejoin="round">
                    <path d="M6 9l6 6 6-6" />
                  </svg>
                  Show More
                </button>
              </div>
            )}
          </div>
        ) : (
          <div>
            <h3 className='history-text'>No exercise data yet...</h3>
            <Link to="/exercise">
              <button className='home-btn'>Add Exercise</button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
