const QuestionText = (question) => {
    console.log(question)
    return (
        <div>
            <div id='questionContainer'>
                <p><b>Reconstruct or fix the following chart for answering the question:</b></p>
                <p>{question.question}</p>
            </div>
        </div>
        
        
    );
  };
  
  export default QuestionText;