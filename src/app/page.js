'use client'
import { useEffect, useState } from 'react';
import embed from 'vega-embed';
import * as vl from 'vega-lite-api';
import { db } from './firebaseConfig';
import { collection, addDoc } from "firebase/firestore";
import QuestionText from './question_text.js';

async function addDataToFireStore(prolificID, score) {
  try {
    const docRef = await addDoc(collection(db, "messages"), {
      prolificID: prolificID,
      score, score,
    });
    console.log("Doc written with ID: ", docRef.id);
    return true;
  } catch (error) {
    console.error("Error ", error)
    return false;
  }
}

export default function HomePage() {
  const [isClient, setIsClient] = useState(false);
  // const [PID, setPID] = useState("")
  const [score, setScore] = useState("") 
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    const queryString = window.location.search;
    console.log(queryString);

    const urlParams = new URLSearchParams(queryString);
    console.log(urlParams)

    const prolific_ID = urlParams.get('PROLIFIC_PID')
    console.log(prolific_ID)

    if (prolific_ID) {
      const added = await addDataToFireStore(prolific_ID, score);
      if (added) {
        // setPID("");
        setScore("");
        alert("Data added!");
      }
    }
    
  };

  // const queryString = window.location.search;
  // console.log(queryString);

  // const urlParams = new URLSearchParams(queryString);
  // console.log(urlParams)

  // const prolificID = urlParams.get('PROLIFIC_PID')
  // console.log(prolificID)

  // // setup API options
  // const options = {
  //   config: {
  //     // Vega-Lite default configuration
  //   },
  //   init: (view) => {
  //     // initialize tooltip handler
  //     view.tooltip(new vegaTooltip.Handler().call);
  //   },
  //   view: {
  //     // view constructor options
  //     // remove the loader if you don't want to default to vega-datasets!
  //     // loader: vega.loader({
  //     //   baseURL: "https://cdn.jsdelivr.net/npm/vega-datasets@2/",
  //     // }),
  //     renderer: "canvas",
  //   },
  // };
  

  useEffect(() => {
    setIsClient(true)
    
    
    // register vega and vega-lite with the API
    // vl.register(vega, vegaLite, options);
    // console.log(data["data"]["values"][0])
    
    // console.log(mark_spec)
    // // .then(viewElement => {
    // //   // render returns a promise to a DOM element containing the chart
    // //   // viewElement.value contains the Vega View object instance
    // //   document.getElementById('view').appendChild(viewElement);
    // // });
    // embed('#vis', mark_spec);

  }, [])

  let data = require('./data.json') // import vega_datasets

  if (isClient) {
    // let mark_spec = vl.markPoint()
    //   .data(data)
    //   .toSpec()
    let mark_spec = require("./rules/I1/I1-14-0.json");
    embed('#vis', mark_spec, {"actions": false});
  }
  
  
  
  // console.log(JSON.stringify(mark_spec))
  // var fs = require('fs');
  // fs.writeFile("vis_spec.json", mark_spec, function(err) {
  //     if (err) {
  //         console.log(err);
  //     }
  // });
 

  var yourVlSpec = {
    $schema: 'https://vega.github.io/schema/vega-lite/v5.json',
    description: 'A simple bar chart with embedded data.',
    data: {
      values: [
        {a: 'A', b: 28},
        {a: 'B', b: 55},
        {a: 'C', b: 43},
        {a: 'D', b: 91},
        {a: 'E', b: 81},
        {a: 'F', b: 53},
        {a: 'G', b: 19},
        {a: 'H', b: 87},
        {a: 'I', b: 52}
      ]
    },
    mark: 'bar',
    encoding: {
      x: {field: 'a', type: 'ordinal'},
      y: {field: 'b', type: 'quantitative'}
    }
  };
  // var moreSpecificSpec = require("./visSpec.json");
  
  

  return (
    <div>
      <div>
        <QuestionText question={"Cars that have horsepower greater than 200 are generally originated from where?"}></QuestionText>
        <div id='visContainer'>
          <div id="vis"></div>
        </div>
        <div>
          <div id='tilesContainer'>
            <div id='chartTypes'>
              <p>Chart Types</p>
              <div>
                <div>
                  <img src='images/chart_types/bar_icon.svg'></img>
                </div>
                <div>
                  <img src='images/chart_types/bar_icon.svg'></img>
                </div>
                <div>
                  <img src='images/chart_types/bar_icon.svg'></img>
                </div>
                <div>
                  <img src='images/chart_types/bar_icon.svg'></img>
                </div>
                <div>
                  <img src='images/chart_types/bar_icon.svg'></img>
                </div>
                <div>
                  <img src='images/chart_types/bar_icon.svg'></img>
                </div>
              </div>
            </div>
            <div id='mappingZone'>
              <div id='encodings'>
                <p>Encodings</p>
                <div>
                  <div>
                    <img src='images/encodings/x_axis_icon.svg'></img>
                  </div>
                  <div>
                    <img src='images/encodings/x_axis_icon.svg'></img>
                  </div>
                  <div>
                    <img src='images/encodings/x_axis_icon.svg'></img>
                  </div>
                </div>
              </div>
              <div id='data'>
                <p>Data</p>
                <div>
                  <div id='mappingContainer'>
                    <div className='inputSpace'>

                    </div>
                    <div className='staticColumn'>
                      <img src='images/encodings/x_axis_icon.svg'></img>
                    </div>
                    <div className='inputSpace'>

                    </div>
                  </div>
                </div>

              </div>
              <div id='transformations'>
                <p>Transformations</p>
                <div>
                  <div>
                    <img src='images/transformations/mean_icon.svg'></img>
                  </div>
                  <div>
                    <img src='images/transformations/mean_icon.svg'></img>
                  </div>
                  <div>
                    <img src='images/transformations/mean_icon.svg'></img>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/*<form onSubmit={handleSubmit}>
         <div>
          <label htmlFor='PID'>
            PID:
          </label>
          <input 
          type='text'
          id='PID'
          value={PID}
          onChange={(e) => setPID(e.target.value)}
          />

        </div> 
        <div>
          <label htmlFor='score'>
            Score:
          </label>
          <input 
          type='text'
          id='score'
          value={score}
          onChange={(e) => setScore(e.target.value)}
          />

        </div>
        <div>
          <button type='submit'>
            Submit
          </button>
        </div>
      </form>*/}
    </div>
      
    
    
    // <div>
    //   <Header title="Develop. Preview. Ship. 🚀" />
    //   <ul>
    //     {names.map((name) => (
    //       <li key={name}>{name}</li>
    //     ))}
    //   </ul>

    //   <button onClick={handleClick}>Like ({likes})</button>
    // </div>
  );
}



// import Image from 'next/image'

// export default function Home() {
//   return (
//     <main className="flex min-h-screen flex-col items-center justify-between p-24">
//       <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex">
//         <p className="fixed left-0 top-0 flex w-full justify-center border-b border-gray-300 bg-gradient-to-b from-zinc-200 pb-6 pt-8 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:static lg:w-auto  lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30">
//           Get started by editing&nbsp;
//           <code className="font-mono font-bold">src/app/page.js</code>
//         </p>
//         <div className="fixed bottom-0 left-0 flex h-48 w-full items-end justify-center bg-gradient-to-t from-white via-white dark:from-black dark:via-black lg:static lg:h-auto lg:w-auto lg:bg-none">
//           <a
//             className="pointer-events-none flex place-items-center gap-2 p-8 lg:pointer-events-auto lg:p-0"
//             href="https://vercel.com?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
//             target="_blank"
//             rel="noopener noreferrer"
//           >
//             By{' '}
//             <Image
//               src="/vercel.svg"
//               alt="Vercel Logo"
//               className="dark:invert"
//               width={100}
//               height={24}
//               priority
//             />
//           </a>
//         </div>
//       </div>

//       <div className="relative flex place-items-center before:absolute before:h-[300px] before:w-[480px] before:-translate-x-1/2 before:rounded-full before:bg-gradient-radial before:from-white before:to-transparent before:blur-2xl before:content-[''] after:absolute after:-z-20 after:h-[180px] after:w-[240px] after:translate-x-1/3 after:bg-gradient-conic after:from-sky-200 after:via-blue-200 after:blur-2xl after:content-[''] before:dark:bg-gradient-to-br before:dark:from-transparent before:dark:to-blue-700 before:dark:opacity-10 after:dark:from-sky-900 after:dark:via-[#0141ff] after:dark:opacity-40 before:lg:h-[360px] z-[-1]">
//         <Image
//           className="relative dark:drop-shadow-[0_0_0.3rem_#ffffff70] dark:invert"
//           src="/next.svg"
//           alt="Next.js Logo"
//           width={180}
//           height={37}
//           priority
//         />
//       </div>

//       <div className="mb-32 grid text-center lg:max-w-5xl lg:w-full lg:mb-0 lg:grid-cols-4 lg:text-left">
//         <a
//           href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
//           className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           <h2 className={`mb-3 text-2xl font-semibold`}>
//             Docs{' '}
//             <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
//               -&gt;
//             </span>
//           </h2>
//           <p className={`m-0 max-w-[30ch] text-sm opacity-50`}>
//             Find in-depth information about Next.js features and API.
//           </p>
//         </a>

//         <a
//           href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
//           className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800 hover:dark:bg-opacity-30"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           <h2 className={`mb-3 text-2xl font-semibold`}>
//             Learn{' '}
//             <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
//               -&gt;
//             </span>
//           </h2>
//           <p className={`m-0 max-w-[30ch] text-sm opacity-50`}>
//             Learn about Next.js in an interactive course with&nbsp;quizzes!
//           </p>
//         </a>

//         <a
//           href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
//           className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           <h2 className={`mb-3 text-2xl font-semibold`}>
//             Templates{' '}
//             <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
//               -&gt;
//             </span>
//           </h2>
//           <p className={`m-0 max-w-[30ch] text-sm opacity-50`}>
//             Explore starter templates for Next.js.
//           </p>
//         </a>

//         <a
//           href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
//           className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           <h2 className={`mb-3 text-2xl font-semibold`}>
//             Deploy{' '}
//             <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
//               -&gt;
//             </span>
//           </h2>
//           <p className={`m-0 max-w-[30ch] text-sm opacity-50`}>
//             Instantly deploy your Next.js site to a shareable URL with Vercel.
//           </p>
//         </a>
//       </div>
//     </main>
//   )
// }
