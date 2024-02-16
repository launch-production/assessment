import ItemComponent from '../ItemComponent';

export default function Page() {
    // const router = useRouter()
    var item_bank = require("../item_bank.json");
    console.log(item_bank)

    var tile_sets = require("../tile_sets.json");
    console.log(tile_sets)
    return (
        <div>
        <ItemComponent 
            item={9} 
            item_bank={item_bank}
            tile_sets={tile_sets}
            />
    </div>
    )
  }