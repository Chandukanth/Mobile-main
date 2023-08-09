
import Fuse from "fuse.js";


const FuseSearch = (searchTerm, keys, sourceList) => {
    try {
        let updatedSearchResult = new Array();

        if (searchTerm && keys && sourceList) {
            //create new instance
            const fuse = new Fuse(sourceList, {
                keys: keys
            })

            //get search result
            let searchResult = fuse.search(searchTerm);

            //validate search result length
            if (searchResult && searchResult.length > 0) {
                //loop the search result
                for (let i = 0; i < searchResult.length; i++) {
                    updatedSearchResult.push(searchResult[i].item);
                }
            }
        }

        return updatedSearchResult;
    } catch (err) {
        console.log(err);
    }
}

export default FuseSearch;