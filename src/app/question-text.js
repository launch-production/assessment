const QuestionText = (question) => {
    console.log(question)
    return (
        <div>
            <div id='questionContainer'>
                <p><b>Use or fix the chart to answer the following question:</b></p>
                <p>{question.question}</p>
            </div>
        </div>
        
        
    );
  };
  
  export default QuestionText;