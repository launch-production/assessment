const QuestionText = (question) => {
    // console.log(question.question)
    return (
        <div>
            <div id='questionContainer'>
                {/* <p><b>Use or fix the chart to answer the following question about {question.question.question_topic}:</b></p> */}
                <p><b>{question.question.question_text}</b></p>
            </div>
        </div>
        
        
    );
  };
  
  export default QuestionText;