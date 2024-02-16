const QuestionText = (question) => {
    console.log(question.question)
    return (
        <div>
            <div id='questionContainer'>
                <p><b>Use or fix the chart to answer the following question about {question.question.question_topic}:</b></p>
                <p>{question.question.question_text}</p>
            </div>
        </div>
        
        
    );
  };
  
  export default QuestionText;