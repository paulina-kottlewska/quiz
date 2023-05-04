import React from "react";
import {nanoid} from "nanoid";
import {decode} from 'html-entities';

export default function Quiz(props) {

    const answers = props.answers;

    // If the 'check answers' button is enabled, compare the answers and change their background based on conditions below.
    function correctBackground(answer) {
        if(props.checkAnswers) {
            if(answer === props.correct) {
                return {backgroundColor: "#94D7A2", border: "none"}
            } else if (answer === props.usersAnswer) {
                return {backgroundColor: "#F8BCBC", border: "none", opacity: "0.5"}
            } else {
                return {backgroundColor: "#F5F7FB", opacity: "0.5"}
            }
        // If the 'check answers' button is diabled, change the background of the answer that the user clicked.
        } else {
            return (answer === props.usersAnswer ? {backgroundColor: "#D6DBF5", border: "none"} : {backgroundColor: "#F5F7FB"}) 
        }
    }

    // Map through the answers and update them according to the received data.
    const buttons = answers.map(answer => (
        <button 
            key={nanoid()} 
            style={correctBackground(answer)}
            className="answers"
            onClick={() => props.handleSelected(props.id, answer)}
            disabled={props.checkAnswers}
            >
                {decode(answer)}
        </button>
    ))
    
    // Display questions and answers.
    return (
        <>
            <h2 className="question">{decode(props.question)}</h2>
                <div className="buttons">
                    {buttons}
                </div>
        </>
    )
}