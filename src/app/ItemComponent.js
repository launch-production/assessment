'use client'
import { useEffect, useState } from 'react';
import embed from 'vega-embed';
import * as vl from 'vega-lite-api';
import { db } from './firebaseConfig';
import { collection, addDoc } from "firebase/firestore";
import QuestionText from './question-text.js';
// import QuestionVis from './question-vis.js';
// import TilesChartTypes from './tiles-chart-types.js';
// import TilesEncodings from './tiles-encodings.js';
// import TilesMappings from './tiles-mappings.js';
// import TilesTransformations from './tiles-transformations.js';
// import { DraftModeProvider } from 'next/dist/server/async-storage/draft-mode-provider';
import { useRouter, usePathname, useSearchParams } from 'next/navigation'

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

function updateEncodingMapping(vis_spec, encoding, update_to, data_columns) {
  console.log("in update x")
  console.log(vis_spec)
  console.log(encoding)
  console.log(update_to)
  if (encoding.includes("color")) {
    vis_spec["encoding"]["color"] = {"field": update_to, "type": data_columns[update_to]["type"]};
    // vis_spec["encoding"]["color"]["field"] = update_to;
    // vis_spec["encoding"]["color"]["type"] = data_columns[update_to];
    // vis_spec["encoding"]["color"]["scale"]["scheme"] = "purplegreen"
    // {"field": update_to, "type": data_columns[update_to]};
    console.log(vis_spec);
    let color_scheme = encoding.split("_")[0];
    console.log(color_scheme)
    // diverging color scheme
    if (color_scheme == "div") {
      vis_spec["encoding"]["color"]["scale"] = {"scheme": "purpleorange"};
      // vis_spec["encoding"]["color"] = {...vis_spec["encoding"]["color"], scale: {scheme: "purplegreen"}}
      // let scale_value = {}
      // scale_value["scale"] = {"scheme": "purplegreen"}
      // // vis_spec["encoding"]["color"]["scale"] = new Map();
      // console.log(scale_value);
      // vis_spec["encoding"]["color"].scale = {};
      // vis_spec["encoding"]["color"].scale.scheme = "purplegreen"
      console.log(vis_spec)
      // ["scheme"] = "purplegreen";
    } else if (color_scheme == "seq") {
      vis_spec["encoding"]["color"]["scale"] = {"scheme": "purplebluegreen"};
      // console.log(vis_spec["encoding"]["color"])
      // embed('#questionVis', vis_spec, {"actions": false});
    } else if (color_scheme == "qual") {
      vis_spec["encoding"]["color"]["scale"] = {"scheme": "dark2"};
    }
  } else {
    vis_spec["encoding"][encoding] = {"field": update_to, "type": data_columns[update_to]["type"]};
  }

  embed('#questionVis', vis_spec, {"actions": false});
  return vis_spec

}

function removeDataEncoding(vis_spec, encoding, remove_data) {
  console.log("in remove data encoding")
  console.log(vis_spec)
  console.log(encoding)
  console.log(remove_data)
  // console.log(mapping_state)
  if (encoding.includes("color")) {
    console.log(encoding);
    vis_spec["encoding"]["color"] = {};
  } else {
    vis_spec["encoding"][encoding] = {};
  }

  embed('#questionVis', vis_spec, {"actions": false});
  return vis_spec
}

function updateMark(vis_spec, mark) {
  console.log("in update mark")
  console.log(vis_spec, mark)
  vis_spec["mark"] = mark;
  embed('#questionVis', vis_spec, {"actions": false});
  return vis_spec
}

function updateTransformationMapping(vis_spec, transformation_encoding, add_transformation, data_columns) {
  console.log("in update transformation!")
  console.log(transformation_encoding)
  console.log(add_transformation)
  if (transformation_encoding.includes("color")) {
    transformation_encoding = "color"
  }
  if (add_transformation == "bin") {
    vis_spec["encoding"][transformation_encoding][add_transformation] = true
  } else if (add_transformation == "count" || add_transformation == "sum") {
    vis_spec["encoding"][transformation_encoding]["aggregate"] = add_transformation;
  } else if (add_transformation == "asc_sort") {
    vis_spec["encoding"][transformation_encoding]["sort"] = "ascending";
  } else if (add_transformation == "des_sort") {
    vis_spec["encoding"][transformation_encoding]["sort"] = "descending";
  } else if (add_transformation == "stack") {
    vis_spec["encoding"][transformation_encoding]["stack"] = true;
  } else if (add_transformation == "reverse") {
    vis_spec["encoding"][transformation_encoding]["scale"] = {"reverse": true};
  } 
  // else if (add_transformation == "truncate") {
  //   let data_var = vis_spec["encoding"][transformation_encoding]["field"]
  //   if (data_columns[data_var]["truncate"]) {
  //     vis_spec["encoding"][transformation_encoding]["scale"] = {...vis_spec["encoding"][transformation_encoding]["scale"], domain: data_columns[data_var]["truncate"], nice: true};
  //     vis_spec["mark"] = {...vis_spec["mark"], clip: true}
  //   }
    
  // }
  console.log(vis_spec)
  embed('#questionVis', vis_spec, {"actions": false});
  return vis_spec
}

function removeTransformationEncoding(vis_spec, transformation_encoding, remove_transformation) {
  console.log("in remove transformation!")
  console.log(transformation_encoding)
  console.log(remove_transformation)
  if (transformation_encoding.includes("color")) {
    transformation_encoding = "color"
  }
  if (remove_transformation == "bin") {
    vis_spec["encoding"][transformation_encoding][remove_transformation] = false
  } else if (remove_transformation == "count" || remove_transformation == "sum") {
    vis_spec["encoding"][transformation_encoding]["aggregate"] = "";
  } else if (remove_transformation == "asc_sort") {
    vis_spec["encoding"][transformation_encoding]["sort"] = null;
  } else if (remove_transformation == "des_sort") {
    vis_spec["encoding"][transformation_encoding]["sort"] = null;
  } else if (remove_transformation == "stack") {
    vis_spec["encoding"][transformation_encoding]["stack"] = "";
  } else if (remove_transformation == "reverse") {
    vis_spec["encoding"][transformation_encoding]["scale"] = {"reverse": false};
  }
  console.log(vis_spec)
  embed('#questionVis', vis_spec, {"actions": false});
  return vis_spec
}

const ItemComponent = (props) => {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [isClient, setIsClient] = useState(false);
  // const [PID, setPID] = useState("")
  const [score, setScore] = useState("") 
  const [chartTypeSelected, setChartTypeSelected] = useState("");
  const [encodingsDisplay, setEncodingDisplay] = useState({});
  const [draggedTile, setDraggedTile] = useState(null);
  const [currentItem, setCurrentItem] = useState("item"+props.item);
  const [itemBank, SetItemBank] = useState(props.item_bank);
  const [tileSets, setTileSets] = useState(props.tile_sets);
  const [currentChartType, setCurrentChartType] = useState(props.item_bank["item"+props.item]["initialize"]["chart_type"]);
  const [dataset, setDataset] = useState(props.item_bank["datasets"][props.item_bank["item"+props.item]["dataset"]]);
  const [loadVis, setLoadVis] = useState(props.item_bank["item"+props.item]["question_vis"]);
  const [currentItemState, setCurrentItemState] = useState(props.item_bank["item"+props.item]["initialize"]);
  const [bankStatus, setBankStatus] = useState({});
  const [noTransformationDisplay, setNoTransformationDisplay] = useState(["truncate"]);
  
  console.log("in item component!")
  console.log(props)
  console.log(props.item_bank)
  console.log(pathname)
  console.log(searchParams)
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

  useEffect(() => {
      setIsClient(true);
      // setChartTypeSelected("scatter");
      // setEncodingDisplay(encodings[chartTypeSelected]);
      // setLoadVis(itemBank["item"+currentItem.toString()]["initialize"]["question_vis"])
      // itemBank["status"]["item"+currentItem] = true
      // setBankStatus(itemBank["status"])
      // var item_state = require("./item_bank_config/item"+currentItem+"_initialize.json");
      // setCurrentItemState(item_state);
      // console.log(item_state)
      // console.log(itemBank["status"])
    }, [])

//   var item_bank = require("./item_bank.json");
//   console.log(item_bank)


  if (isClient) {
  // let mark_spec = vl.markPoint()
  //   .data(data)
  //   .toSpec()
  // let mark_spec = require("./rules/I1/I1-14-0.json");
    // let mark_spec = require("./question_vis/item1.json");
    // let vis_spec = item_bank["item"+currentItem.toString()]["initialize"]["question_vis"]
    // let vis_json = require(loadVis)
    // console.log(itemBank["item"+currentItem.toString()])
    // setLoadVis(itemBank["item"+currentItem.toString()]["initialize"]["question_vis"])
    // itemBank["status"]["item"+currentItem] = true
    // setBankStatus(itemBank["status"])
    // var item_state = require("./item_bank_config/item"+currentItem+"_initialize.json");
    // setCurrentItemState(item_state);
    // console.log(item_state)
    // console.log(itemBank["status"])
    console.log(loadVis)
    // let mark_spec = require(item_bank["item"+currentItem.toString()]["initialize"]["question_vis"]);
    embed('#questionVis', loadVis, {"actions": false});
    // console.log(require(mark_spec))
  }

  

  let chart_types = Object.keys(tileSets)
  // let types_list = chart_types.charts_index;
  // let tile_types = chart_types.types
  console.log(chart_types)

  let transformations = tileSets[currentChartType]["transformations"];
  // let actions_list = transformations.transformation_index;
  // let action_types = transformations.actions
  // console.log(action_types)

  let encodings = tileSets[currentChartType]["encodings"];
  console.log(encodings)
  // console.log(chartTypeSelected)
  // console.log(encodings[chartTypeSelected])

  let read_dataset = dataset;
  console.log(read_dataset)
  let data_columns = Object.keys(read_dataset)
  console.log(data_columns)
  
  const changeChartType = (clicked_chart) => {
    console.log("clicked")
    console.log(clicked_chart)
    setChartTypeSelected(clicked_chart);
    // setEncodingDisplay(tileSets[clicked_chart]["encodings"]);
    let vis_update = loadVis
    updateMark(vis_update, clicked_chart)
  }


  const drag = (element) => {
    console.log("in drag")
    console.log(element.dataTransfer)
    console.log(element.target)
    // let element_id = element.target.id.split("-")
    // if (element_id.length == 3) {
    //   element.target.id = element_id[0] + "-" + element_id[1]
    // }
    element.dataTransfer.setData("text", element.target.id);
    // setDraggedTile(element.target);
    // element.dataTransfer.setData("text", "");
  }

  const allowDrop = (ev) => {
    // if (draggedTile) {
      ev.preventDefault();
    // }
    
  }

  const dataDrop = (ev) => {
    ev.preventDefault();
    console.log("in drop")
    console.log(ev.target)
    // console.log(ev.target.getAttribute('data-draggable'))
    var data = ev.dataTransfer.getData("text");
    console.log(data)
    if (data.includes("data") && ev.target.getAttribute('data-draggable') == "target") {
      console.log("dropping!")
      // ev.target.appendChild(draggedTile); // todo try not using setstate, and append by id?
      let drop_container = ev.target;
      // drop_container.innerHTML = "";
      drop_container.appendChild(document.getElementById(data).cloneNode(true));
      let add_data = data.split("-")[1]
      let find_encoding = drop_container.nextSibling.firstChild.id.split("-")[1] // TODO fix; check have an unique separator
      drop_container.firstChild.id += "-";
      drop_container.firstChild.id += find_encoding;
      console.log(find_encoding)
      let vis_update = loadVis
      let updated_spec = updateEncodingMapping(vis_update, find_encoding, add_data, dataset);
      console.log(updated_spec)
      console.log(loadVis)
      // if (find_encoding.includes("color")) {
      //   vis_update["encoding"][find_encoding.split("_")[1]] = {"field": add_data, "type": "nominal"}; // TODO need a dictionary for looking up each data column type
      // }
      
      // console.log(vis_update)
      setLoadVis(updated_spec)
      // console.log(loadVis)
      // embed('#questionVis', loadVis, {"actions": false});
      // let state_change = currentItemState
      
      // for (var [key, value] of Object.entries(currentItemState)) {
      //   // console.log(key, value);
        
      //   // console.log(extract_data)
      //   console.log(value["data"])
      //   // TODO: fix this portion
      //   if (key == "seq_color" || key == "div_color") {
      //       // let extract_encoding = key.split("_")[0];
      //       // console.log(extract_encoding)
      //       vis_update["encoding"]["color"] = {"field": add_data}
      //   }
          
      
      //   }
      // }
      // setCurrentItemState(state_change)
      // ev.preventDefault();
    }
    // if (data.includes("data")) {
    //   
    // }
    
  }

  const transformationDrop = (ev) => {
    ev.preventDefault();
    console.log("in transformation drop")
    console.log(ev.target)
    // console.log(ev.target.getAttribute('data-draggable'))
    var data = ev.dataTransfer.getData("text");
    console.log(data)
    if (data.includes("transformation") && ev.target.getAttribute('data-draggable') == "transformation_target") {
      console.log("dropping transformation!")
      // ev.target.appendChild(draggedTile); // todo try not using setstate, and append by id?
      let drop_container = ev.target;
      // drop_container.innerHTML = "";
      drop_container.appendChild(document.getElementById(data).cloneNode(true));
      let add_transformation = data.split("-")[1]
      console.log(drop_container)
      let find_transformation_encoding = drop_container.previousSibling.firstChild.id.split("-")[1]
      drop_container.firstChild.id += "-";
      drop_container.firstChild.id += find_transformation_encoding;
      let vis_update = loadVis
      let updated_spec = updateTransformationMapping(vis_update, find_transformation_encoding, add_transformation, dataset);
      // let extract_transformation_encoding = find_transformation_encoding
      // if (find_transformation_encoding.includes("color")) {
      //   extract_transformation_encoding = find_transformation_encoding.split("_")[1];
      //   // vis_update["encoding"][find_transformation_encoding.split("_")[1]]["aggregation"] = add_transformation; // TODO need a dictionary for looking up each data column type and where the transformaiton should be
      // } else if (find_transformation_encoding.includes("axis")) {
      //   extract_transformation_encoding = find_transformation_encoding.split("_")[0];
      //   // vis_update["encoding"][find_transformation_encoding.split("_")[0]] = {"field": add_transformation, "type": "nominal"}; // TODO need a dictionary for looking up each data column type
      // }
      // vis_update["encoding"][extract_transformation_encoding]["aggregate"] = add_transformation; // TODO need a dictionary for looking up each data column type and where the transformaiton should be
      // ev.preventDefault();
      console.log(updated_spec)
      setLoadVis(updated_spec)
      // console.log(loadVis)
      // embed('#questionVis', loadVis, {"actions": false});
    }
    // if (data.includes("data")) {
    //   
    // }
    
  }

  const removeDataTile = (ev) => {
    console.log("in click")
    console.log(ev.target.id)
    console.log(loadVis)
    console.log(currentItemState)
    if (ev.target.id.includes("data")) {
      let state_change = currentItemState
      let vis_update = loadVis
      let mapping_info = ev.target.id.split("-")
      removeDataEncoding(vis_update, mapping_info[2], mapping_info[1])
      // for (var [key, value] of Object.entries(currentItemState)) {
      //   // console.log(key, value);
      //   let extract_data = ev.target.id.split("-")[1]
      //   // console.log(extract_data)
      //   console.log(value["data"])
      //   if (value["data"] == extract_data) {
      //     console.log(key)
      //     // TODO: fix this portion
      //     if (key == "x_axis" || key == "y_axis") {
      //       let extract_encoding = key.split("_")[0];
      //       console.log(extract_encoding)
      //       vis_update["encoding"][extract_encoding] = ""
      //     } else {
      //       vis_update["encoding"][key] = ""
      //     }
          
      //     state_change[key]["data"] = ""
      //   }
      // }
      setLoadVis(vis_update);
      // setCurrentItemState(state_change)
      // embed('#questionVis', loadVis, {"actions": false});
      // console.log(vis_update)
      // console.log(ev.target.parentNode)
      ev.target.parentNode.innerHTML = "";
    }
  }

  const removeTransformationTile =(ev) => {
    console.log("in transformation click")
    console.log(ev.target.id)
    console.log(loadVis)
    console.log(currentItemState)
    if (ev.target.id.includes("transformation")) {
      let state_change = currentItemState
      let vis_update = loadVis
      let mapping_info = ev.target.id.split("-")
      removeTransformationEncoding(vis_update, mapping_info[2], mapping_info[1]);
      // for (var [key, value] of Object.entries(currentItemState)) {
      //   // console.log(key, value);
      //   let extract_transformation = ev.target.id.split("-")[1]
      //   // console.log(extract_data)
      //   console.log(value["transformation"])
      //   if (value["transformation"] == extract_transformation) {
      //     console.log(key)
      //     // TODO: fix this portion
      //     console.log(ev.target.parentNode.previousSibling.firstChild.id)
      //     let corresponding_encoding = ev.target.parentNode.previousSibling.firstChild.id.split("-")[1]
      //     // let extract_encoding = key.split("_")[0];
      //     // console.log(extract_encoding)
      //     if (key == corresponding_encoding) {
      //       if (key == "x_axis" || key == "y_axis") {
      //         console.log("deleting for"+key.split("_")[0])
      //         delete vis_update["encoding"][key.split("_")[0]]["aggregate"]
      //         state_change[key]["transformation"] = ""
      //       } else {
      //         vis_update["encoding"][key]["aggregate"] = ""
      //       }
              
      //     }
          
          
      //   }
      // }
      setLoadVis(vis_update);
      // setCurrentItemState(state_change)
      // embed('#questionVis', loadVis, {"actions": false});
      // console.log(vis_update)
      // console.log(state_change)
      // console.log(ev.target.parentNode)
      ev.target.parentNode.innerHTML = "";
    }
  }

  const nextItem = () => {
    console.log("clicking next")
    let current_item = props.item;
    let next_item = current_item + 1
    console.log(next_item)
    if (next_item <= 2) {
    //   setCurrentItem(next_item);
    //   setLoadVis(itemBank["item"+next_item.toString()]["initialize"]["question_vis"])
    //   console.log(document.getElementsByClassName("inputSpace"))
      // let to_clear = document.getElementsByClassName("inputSpace")
      // for (let i = 0; i < to_clear.length; i += 1) {
      //   to_clear[i].innerHTML = "<p></p>";
      // }

      // var current_item_state = require("./item_bank_config/item"+current_item+"_initialize.json");
      // setCurrentItemState(current_item_state);
      // let clear_state = currentItemState
      // for (var [key, value] of Object.entries(currentItemState)) {
      //   // console.log(key, value);
      //   if (value["data"]) {

      //   }
      //   clear_state[key]["data"] = "";
      //   clear_state[key]["transformation"] = "";
      //   // let extract_data = ev.target.id.split("_")[1]
      //   // // console.log(extract_data)
      //   // console.log(value["data"])
      //   // if (value["data"] == extract_data) {
      //   //   console.log(key)
      //   //   // TODO: fix this portion
      //   //   if (key == "x_axis" || key == "y_axis") {
      //   //     let extract_encoding = key.split("_")[0];
      //   //     console.log(extract_encoding)
      //   //     vis_update["encoding"][extract_encoding] = ""
      //   //   } else {
      //   //     vis_update["encoding"][key] = ""
      //   //   }
          
      //   //   state_change[key]["data"] = ""
      //   }
      //   setCurrentItemState(clear_state);      

    //   var next_item_state = require("./item_bank_config/item"+next_item+"_initialize.json");
    //   setCurrentItemState(next_item_state);
    //   itemBank["status"]["item"+next_item] = true
    //   setBankStatus(itemBank["status"])
    //   console.log(currentItemState)
    //   console.log(itemBank["status"])
      router.push('/Q'+next_item)
    }
    

    // write to DB and reset [necessary/written variables]
  }
  // document.getElementById('exportText').addEventListener('click', function() {
  //   console.log(document.getElementById('yourname').value)
  // })


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
  

  // useEffect(() => {
  //   setIsClient(true)
    
    
  //   // register vega and vega-lite with the API
  //   // vl.register(vega, vegaLite, options);
  //   // console.log(data["data"]["values"][0])
    
  //   // console.log(mark_spec)
  //   // // .then(viewElement => {
  //   // //   // render returns a promise to a DOM element containing the chart
  //   // //   // viewElement.value contains the Vega View object instance
  //   // //   document.getElementById('view').appendChild(viewElement);
  //   // // });
  //   // embed('#vis', mark_spec);

  // }, [])

  // let data = require('./data.json') // import vega_datasets
  // let mark_spec = vl.markPoint()
  //     .data(data)
  //     .size("")
  //     .toSpec()

  // // mark_spec_update = mark_spec.size("")
  // console.log(mark_spec)

  // if (isClient) {
  //   // let mark_spec = vl.markPoint()
  //   //   .data(data)
  //   //   .toSpec()
  //   // let mark_spec = require("./rules/I1/I1-14-0.json");
  //   // embed('#vis', mark_spec, {"actions": false});
  //   let chart_types = {};
  //   fetch('./tiles/chart-types.json')
  //       .then((res) => {
  //           if (!res.ok) {
  //               throw new Error
  //                   (`HTTP error! Status: ${res.status}`);
  //           }
  //           return res.json();
  //       })
  //       .then((data) => {
  //           console.log(data);
  //           chart_types = data
  //       })
  //       .catch((error) => 
  //           console.error("Unable to fetch data:", error));
    
  //   console.log(chart_types)
  // }
  
  
  
  // console.log(JSON.stringify(mark_spec))
  // var fs = require('fs');
  // fs.writeFile("vis_spec.json", mark_spec, function(err) {
  //     if (err) {
  //         console.log(err);
  //     }
  // });
 

  // var yourVlSpec = {
  //   $schema: 'https://vega.github.io/schema/vega-lite/v5.json',
  //   description: 'A simple bar chart with embedded data.',
  //   data: {
  //     values: [
  //       {a: 'A', b: 28},
  //       {a: 'B', b: 55},
  //       {a: 'C', b: 43},
  //       {a: 'D', b: 91},
  //       {a: 'E', b: 81},
  //       {a: 'F', b: 53},
  //       {a: 'G', b: 19},
  //       {a: 'H', b: 87},
  //       {a: 'I', b: 52}
  //     ]
  //   },
  //   mark: 'bar',
  //   encoding: {
  //     x: {field: 'a', type: 'ordinal'},
  //     y: {field: 'b', type: 'quantitative'}
  //   }
  // };
  // var moreSpecificSpec = require("./visSpec.json");
  
  

  return (
    <div>
        {isClient ? <QuestionText question={itemBank[currentItem]["question_text"]}></QuestionText> : null}
        <div id='visContainer'>
            <div id="questionVis"></div>
            <div id="answerVis"></div>
        </div>
        <div id='tilesContainer'>
          <div id='chartTypes'>
            <p>Chart Types</p>
            <div>
              {chart_types.map(chart_tiles => (
                  <div key={chart_tiles}>
                      <img className="chartTiles" src={tileSets[chart_tiles]["chart"]} onClick={() => changeChartType(chart_tiles)}></img>
                  </div>
              ))}
            </div>
          </div>
          <div id='mappingZone'>
            <div id='data'>
              <p>Data</p>
              {data_columns.map(variable => (
                  <div key={variable} className="dataTileContainer">
                    <div className="dataTiles" id={"data-"+variable} draggable="true" onDragStart={(event) => drag(event)}><p>{variable}</p></div>
                  </div>
                ))}
            </div>
            <div id='encodings'>
                <p>Encodings</p>
                <div>
                  { Object.entries(encodings).map((encoding_icon, index) => (
                    <div className='mappingContainer' key={"mapping-"+index}>
                      <div className='inputSpace' key={"input-"+index} data-draggable="target" onDrop={(event) => dataDrop(event)} onDragOver={(event) => allowDrop(event)} onClick={(event) => removeDataTile(event)}>
                        { Object.entries(currentItemState["encodings"]).map((data_mapping, index) => (
                          (data_mapping[0] == encoding_icon[0] && data_mapping[1]["data"]) ? 
                            <div key={"fill-data-"+index} className="dataTiles" id={"data-"+data_mapping[1]["data"]+"-"+encoding_icon[0]}><p>{data_mapping[1]["data"]}</p></div>
                          : null
                          ))}
                      </div>
                      <div className='staticColumn' key={index}>
                        <img id={"encoding-"+encoding_icon[0]} src={encoding_icon[1]}></img>
                      </div>
                      <div className='inputSpace' key={"input-transform"+index} data-draggable="transformation_target" onDrop={(event) => transformationDrop(event)} onDragOver={(event) => allowDrop(event)} onClick={(event) => removeTransformationTile(event)}>
                      { Object.entries(currentItemState["encodings"]).map((data_mapping, index) => (
                          (data_mapping[0] == encoding_icon[0] && data_mapping[1]["transformation"]) ? 
                            <img key={"fill-transformation-"+index} src={transformations[data_mapping[1]["transformation"]]} id={"transformation-"+data_mapping[1]["transformation"]+"-"+encoding_icon[0]} className="transformationTiles"></img>
                          : null
                          ))}
                      </div>
                    </div>
                  ))}
                  
                </div>

              </div>
              <div id='transformations'>
                <p>Transformations</p>
                <div>
                  {Object.entries(transformations).map((transformation_tiles, index) => (
                    noTransformationDisplay.includes(transformation_tiles[0]) ? null :
                    <div key={"action"+index} >
                      <img  src={transformation_tiles[1]} id={"transformation-"+transformation_tiles[0]} className="transformationTiles" draggable="true" onDragStart={(event) => drag(event)}></img>
                    </div>
                  ))}
                  
                </div>
              </div>
          </div>
        </div>
      <div id="nextButton" onClick={() => nextItem()}>
        <p>Next</p>
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

  );
}

export default ItemComponent;
