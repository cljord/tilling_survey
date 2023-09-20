import React, { useState } from "react";
import MapboxComponent from "./Mapbox.jsx";

const MapboxSurvey = ({ onComplete, onBack, responses, updateResponses }) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [mapMarks, setMapMarks] = useState([]);
  const minMapMarks = 3;

  const handleMapMarks = (marks) => {
    setMapMarks(marks);
  };

  const handleNextPage = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  const handlePreviousPage = () => {
    setCurrentPage((prevPage) => prevPage - 1);
  };

  const handleComplete = () => {
    if (mapMarks.length >= minMapMarks) {
      onComplete(mapMarks);
    } else {
      // Handle the case where not enough map marks are made
      // You can show an error message or take other actions
    }
  };

  const handleMapboxResponse = (markNumber, questionId, value) => {
    // Update the responses object passed from App.jsx
    const updatedResponses = { ...responses };
    updatedResponses[questionId] = value;
    updateResponses(updatedResponses);

    // Continue updating other state or data as needed
    const updatedMarks = [...mapMarks];
    const updatedMark = { ...updatedMarks[markNumber] };
    const updatedMarkQuestions = { ...updatedMark.questions };
    updatedMarkQuestions[questionId] = value;
    updatedMark.questions = updatedMarkQuestions;
    updatedMarks[markNumber] = updatedMark;
    setMapMarks(updatedMarks);
  };

  // Function to generate fixed questions for a mark
  const generateMarkQuestions = (markNumber) => {
    const questions = [];
    // Define your fixed set of questions here
    // You can create questions dynamically if needed
    questions.push({
      id: `mark_${markNumber}_question_1`,
      text: `Question 1 for Mark ${markNumber + 1}`,
      type: "text",
    });
    questions.push({
      id: `mark_${markNumber}_question_2`,
      text: `Question 2 for Mark ${markNumber + 1}`,
      type: "text",
    });
    // Add more questions as needed
    return questions;
  };

  const renderQuestions = () => {
    if (currentPage === 0) {
      // Page 1: Map Marking
      return (
        <div>
          <h2>Map Marking</h2>
          <MapboxComponent mapMarks={mapMarks} onComplete={handleMapMarks} center={{latitude: 50, longitude: 11}} />
          <p>Please mark at least {minMapMarks} sections on the map.</p>
        </div>
      );
    } else if (currentPage <= mapMarks.length) {
      const markNumber = currentPage - 1;
      const mark = mapMarks[markNumber];
      const markQuestions = generateMarkQuestions(markNumber);
      console.log("Mark: ", mark)

      return (
        <div>
          <h2>Questions for Mark {markNumber + 1}</h2>
          <MapboxComponent mapMarks={mapMarks} center={mark} onComplete={handleMapMarks} />
          {markQuestions.map((question) => (
            <div key={question.id}>
              <label>{question.text}</label>
              <input
                type="text"
                value={responses[question.id] || ""}
                onChange={(e) =>
                  handleMapboxResponse(markNumber, question.id, e.target.value)
                }
              />
            </div>
          ))}
        </div>
      );
    }
  };

  return (
    <div>
      <h1>Mapbox Survey</h1>
      {renderQuestions()}
      <div>
        {currentPage === 0 && <button onClick={onBack}>Back to User Agreement</button>}
        {currentPage > 0 && (
          <button onClick={handlePreviousPage}>Previous Page</button>
        )}
        {currentPage < mapMarks.length && (
          <button
            onClick={handleNextPage}
            disabled={mapMarks.length < minMapMarks}
          >
            Next Page
          </button>
        )}
        {currentPage === mapMarks.length && (
          <button onClick={handleComplete}>Next Page</button>
        )}
      </div>
    </div>
  );
};

export default MapboxSurvey;