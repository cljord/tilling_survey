import React, { useState } from "react";
import surveyQuestions from "./questions";

const Survey = ({ onBack }) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [responses, setResponses] = useState(Array(surveyQuestions.length).fill({}));

  const handleInputChange = (questionId, value) => {
    const updatedResponses = [...responses];
    updatedResponses[currentPage] = { ...updatedResponses[currentPage], [questionId]: value };
    setResponses(updatedResponses);
  };

  const handleNextPage = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  const handlePreviousPage = () => {
    setCurrentPage((prevPage) => prevPage - 1);
  };

  const handleSubmit = () => {
    // No backend integration currently, so just log the survey response for debugging
    console.log(responses);
  };

  const renderQuestion = (question) => {
    const { id, text, type, options } = question;

    if (type === "text") {
      return (
        <div key={id}>
          <label>{text}</label>
          <input
            type="text"
            value={responses[currentPage][id] || ""}
            onChange={(e) => handleInputChange(id, e.target.value)}
          />
        </div>
      );
    } else if (type === "radio") {
      return (
        <div key={id}>
          <p>{text}</p>
          {options.map((option, index) => (
            <label key={index}>
              <input
                type="radio"
                name={`question_${id}`}
                value={option}
                checked={responses[currentPage][id] === option}
                onChange={() => handleInputChange(id, option)}
              />
              {option}
            </label>
          ))}
        </div>
      );
    }

    return null;
  };

  return (
    <div>
      <h1>Umfrage</h1>
      {surveyQuestions[currentPage].map(renderQuestion)}
      <div>
        {currentPage == 0 && <button onClick={onBack}>Zur Einverständniserklärung</button>}
        {currentPage > 0 && <button onClick={handlePreviousPage}>Vorherige Seite</button>}
        {currentPage < surveyQuestions.length - 1 && <button onClick={handleNextPage}>Nächste Seite</button>}
        {currentPage === surveyQuestions.length - 1 && <button onClick={handleSubmit}>Abschicken</button>}
      </div>
    </div>
  );
};

export default Survey;