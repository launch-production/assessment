const QuestionText = (question) => {
    // console.log(question.question)
    return (
        <div>
            <div id='questionContainer'>
                <p><b>Create a chart to support or negate the following statement:</b></p>
                <p><i>{question.question.question_text}</i></p>
            </div>
        </div>
        
        
    );
  };
  
  export default QuestionText;