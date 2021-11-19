var express = require("express");
var router = express.Router();
// Below I import the file system and node-fetch modules
const fileHandler = require("fs");
const fetch = require("node-fetch");

// Below I parse the two custom json files that is read by the front-end
const favorites = JSON.parse(fileHandler.readFileSync("./public/favorites.json"));
const searchResults = JSON.parse(fileHandler.readFileSync("./public/searchResults.json"));

//================ DEFAULT GET ============================================================
// This displays the search result
router.get("/search", (request, response) => {
  response.send(searchResults);
});

// This displays the favorite list
router.get("/favorites", (request, response) => {
  response.send(favorites);
});

//================ SEARCH ONLY GET =========================================================

// This get method is called when the user provides only a search term
// I obtain the search info through request.params.
// I then make a fetch request to the 3rd party Api and add the data to an array.
// This array data is written to the searchResults array
// I also update searchResults.json

router.get("/get/:search", (request, response) => {
  const searchTerm = request.params.search;

  // Here I splice the array to prevent the new search data from stacking on the old data
  searchResults.splice(0, searchResults.length);

  async function fetchData() {
    try {
      const fetchData = await fetch(`https://itunes.apple.com/search?term=${searchTerm}`);
      const processData = await fetchData.json();

      for (let i = 0; i < (await processData.results.length); i++) {
        console.log(
          `Artist name: ${await processData.results[i]
            .artistName}, Track name: ${await processData.results[i]
            .trackName}, Media type: ${await processData.results[i]
            .kind}, Track ID: ${await processData.results[i].trackId},`
        );
      }

      for (let a = 0; a < (await processData.results.length); a++) {
        searchResults.push(await processData.results[a]);
      }

      fileHandler.writeFile(
        "./public/searchResults.json",
        JSON.stringify(searchResults, null, 2),
        (error) => {
          if (error) throw error;
          else console.log("searchResult updated");
        }
      );

      return response.json({ searchResults });
    } catch (error) {
      console.log(`FAILED: ${error}`);
    }
  }

  fetchData();
});

//================ SEARCH AND MEDIA TYPE GET ============================================================

// This get method is called when the user provides a search term and selects a category other than 'all'
// I obtain the search and mediaType info through request.params.
// I then make a fetch request to the 3rd party Api and add the data to an array.
// This array data is written to the searchResults array
// I also update searchResults.json

router.get("/getMedia/:search/:mediaType", (request, response) => {
  const searchTerm = request.params.search;
  const mediaType = request.params.mediaType;

  // Here I splice the array to prevent the new search data from stacking on the old data
  searchResults.splice(0, searchResults.length);

  fetch(`https://itunes.apple.com/search?term=${searchTerm}${mediaType}`)
    .then((res) => res.json())
    .then(
      (result) => {
        for (let i = 0; i < result.results.length; i++) {
          console.log(
            `Artist name: ${result.results[i].artistName}, Track name: ${result.results[i].trackName}, Media type: ${result.results[i].kind}, Track ID: ${result.results[i].trackId},`
          );
        }

        for (let a = 0; a < result.results.length; a++) {
          searchResults.push(result.results[a]);
        }

        fileHandler.writeFile(
          "./public/searchResults.json",
          JSON.stringify(searchResults, null, 2),
          (error) => {
            if (error) throw error;
            else console.log("searchResult updated");
          }
        );

        return response.json({ searchResults });
      },
      (error) => {
        console.log(error);
      }
    );
});

//================ Add to favorites:POST ================================================================

// This post method is used to add data to the favorites array and favorites.json file
// I get a specific id from the front-end that corresponds with the data in the searchResults array
// I then push the appropriate searchResults array element to the favorites array

router.post("/post/:id", (request, response) => {
  const id = request.params.id;

  const newFavorite = searchResults[id];

  favorites.push(newFavorite);

  fileHandler.writeFile(
    "./public/favorites.json",
    JSON.stringify(favorites, null, 2),
    (error) => {
      if (error) throw error;
      else console.log("favorites.json updated");
    }
  );

  return response.json({ favorites });
});

//================ Remove from favorites:DELETE =====================================================

// This delete method is used to remove data from the favorites array and favorites.json file
// I get a specific id from the front-end that corresponds with the data in the searchResults array
// I then splice the appropiate element from the favorites array

router.delete("/delete/:id", (request, response) => {
  const id = request.params.id;

  favorites.splice(id, 1);

  fileHandler.writeFile(
    "./public/favorites.json",
    JSON.stringify(favorites, null, 2),
    (error) => {
      if (error) throw error;
      else console.log("favorites.json updated");
    }
  );

  return response.json({ favorites });
});

module.exports = router;
