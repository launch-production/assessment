import StartTraining from '../training';

export default function Page() {
    // const router = useRouter()
    var training_set = require("../training_set.json");
    console.log(training_set)

    var tile_sets = require("../tile_sets.json");
    console.log(tile_sets)
    return (
        <div>
        <StartTraining 
            item={102} 
            training_set={training_set}
            tile_sets={tile_sets}
            />
    </div>
    )
  }