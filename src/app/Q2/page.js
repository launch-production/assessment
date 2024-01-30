import ItemComponent from '../ItemComponent';

export default function Page() {
    // const router = useRouter()
    var item_bank = require("../item_bank.json");
    console.log(item_bank)
    return (
        <div>
        <ItemComponent 
            item={2} 
            item_bank={item_bank}
            />
    </div>
    )
  }