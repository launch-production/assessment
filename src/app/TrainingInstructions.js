'use client'
import { useEffect, useState } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation'

const TrainingInstructions = () => {
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        //   if (!isClient) {
        //     if (props.item == 1) {
        //       let start_time = new Date().getTime()
        //       console.log("printing time!!")
        //       console.log(start_time)
        //       setStartTime(start_time)
        //     }
        //   }
          setIsClient(true);
        //   const queryString = window.location.search;
        //   console.log(queryString);
      
        //   const urlParams = new URLSearchParams(queryString);
        //   console.log(urlParams)
      
        //   const prolific_ID = urlParams.get('PROLIFIC_PID')
        //   console.log(prolific_ID)
        //   setPID(prolific_ID);
          
          
          // setChartTypeSelected("scatter");
          // setEncodingDisplay(encodings[chartTypeSelected]);
          // setLoadVis(itemBank["item"+currentItem.toString()]["initialize"]["question_vis"])
          // itemBank["status"]["item"+currentItem] = true
          // setBankStatus(itemBank["status"])
          // var item_state = require("./training_set_config/item"+currentItem+"_initialize.json");
          // setCurrentItemState(item_state);
          // console.log(item_state)
          // console.log(itemBank["status"])
    }, [])

    // console.log(question.question)
    const nextItem = (e) => {
    
        console.log("clicking next")
        // let current_item = props.item;
        // let next_item = current_item + 1
        // console.log(next_item)
        // if (next_item > 100 && next_item <= 103) {
        //   let text_answer = document.getElementById("questionAnswer").value
        //   console.log(text_answer)
        //   if (text_answer) {
        //     // handleSubmit(e, "item_"+current_item, startTime, text_answer)
        //     let url_pid = "/?PROLIFIC_PID=" + pID;
        //     router.push('/start'+next_item+url_pid)
        //   }
          
        // } else {
        // //   let text_answer = document.getElementById("questionAnswer").value
        // //   console.log(text_answer)
        // //   if (text_answer) {
        //     // handleSubmit(e, "item_"+current_item, startTime, text_answer)
        //     let url_pid = "/?PROLIFIC_PID=" + pID;
        //     router.push('/Q1'+url_pid)
        // //   }
        // }
        
    
        // write to DB and reset [necessary/written variables]
      }
    return (
        <div>
            {isClient ? <div id='questionContainer'>
            <div>
                <h3>Instructions for Training Section</h3>
                <p><b>You are about to begin the training section.</b></p>
                <p>This section is expected to take approximately 15 minutes.</p>
                <p>For successsful completion, you must answer all questions in this survey.</p>
                <p><i>Note you will not be able to go back once you advance to the next question.</i></p>
                <p>Click 'Start Training' to proceed.</p>
            </div>
            <div id="nextButton" onClick={(e) => nextItem(e)}>
                <p>Start Training</p>
            </div>
            </div> :null}

        </div>
        
        
    );
  };
  
  export default TrainingInstructions;