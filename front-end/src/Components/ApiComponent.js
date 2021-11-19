import React from "react";
// Below I import bootstrap components
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Accordion from "react-bootstrap/Accordion";

class ApiComponent extends React.Component {
  constructor(props) {
    super(props);

    // Here I bind the custom functions
    this.backEndGet = this.backEndGet.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.addToFavorites = this.addToFavorites.bind(this);
    this.removeFromFavorites = this.removeFromFavorites.bind(this);

    // Below I have two sets of states
    this.state = {
      error: null,
      favoriteListError: null,
      isLoaded: false,
      favoriteListIsLoaded: false,
      backEndItems: [],
      favoriteItems: [],
    };

    this.state = {
      searchValue: "",
    };
  }

  // This function updates 'searchValue' when something is typed into the search bar
  handleChange(event) {
    this.setState({ searchValue: event.target.value });
  }

  //===================== iTunes API: GET =========================================================

  // This function is used to send the appropiate info to the back-end to make a fetch call to the 3rd party API
  // It either sends just the search term to the back-end or it sends the search term and the specified media type
  //  to the back-end.
  // I get the search term from the handleChange function and I get the media type from the select element

  async backEndGet() {
    let select = document.getElementById("typeSelect");
    let selectedOption = select.value;

    if (selectedOption !== "") {
      try {
        const fetchApi = await fetch(
          `/api/getMedia/${this.state.searchValue}/&entity=${selectedOption}`
        );
        await fetchApi.json();
        console.log("Successfuly fetched");
      } catch (error) {
        alert(`Error: ${error}`);
      }
    } else {
      try {
        const fetchApi = await fetch(`/api/get/${this.state.searchValue}`);
        await fetchApi.json();
        console.log("Successfuly fetched");
      } catch (error) {
        alert(`Error: ${error}`);
      }
    }

    // Here I reload the page after a delay
    setTimeout(() => window.location.reload(), 1300);
  }

  //===================== .json files: GET ==============================================================

  // This function loads the two json files on the page.
  // I make a double fetch request to the back-end using the Promise.all method.

  componentDidMount() {
    Promise.all([
      fetch("/api/search").then((res) => res.json()),
      fetch("/api/favorites").then((res) => res.json()),
    ]).then(([firstResult, secondResult]) => {
      this.setState({
        isLoaded: true,
        backEndItems: firstResult,
        favoriteListIsLoaded: true,
        favoriteItems: secondResult,
      });
    });
  }

  //====================== Add to favorites:POST ==========================================================

  // This is used to add specific search result data to the favorites list.
  // I get the correct value from the button that is rendered with each list item/result item.
  // Both the button and the result item have the same id.
  // This function is used to send the appropiate index value to the back-end. The back-end will then use
  //  that value to push the appropiate data to the favorites array and will then update favorites.json

  addToFavorites(event) {
    let indexNumber = event.target.id;

    fetch(`/api/post/${indexNumber}`, {
      method: "POST",
    }).then((res) => res.json());

    // Here I reload the page after a delay
    setTimeout(() => window.location.reload(), 1000);
  }

  //====================== Remove from favorites:DELETE ====================================================

  // This is used to remove specific data from the favorites list.
  // I get the correct value from the button that is rendered with each list item.
  // Both the button and the list item have the same id.
  // This function is used to send the appropiate index value to the back-end. The back-end will then use
  //  that value to splice the appropiate data from the favorites array and will then update favorites.json

  removeFromFavorites(event) {
    let indexNumber = event.target.id;

    fetch(`/api/delete/${indexNumber}`, {
      method: "DELETE",
    }).then((res) => res.json());

    setTimeout(() => window.location.reload(), 1000);
  }

  //====================== Render Section =================================================================

  render() {
    // These two variables are used to ensure that there is no identical key values for rendered list items
    let favoriteListKey = 100;
    let searchResultKey = 1000;

    const { error, isLoaded, backEndItems, favoriteItems } = this.state;
    if (error) return <div>Error: {error.message}</div>;
    else if (!isLoaded) return <div>Loading...</div>;
    else {
      return (
        // I make use of containers, rows, columns and accordions imported from react bootstrap
        // I map both the favorites list and the search results on the page
        // I use custom css styling to further modify the visuals

        <Container id="outerContainer">
          <Row>
            {/* ========================== Renders the favorite list ==================================== */}
            <Col xs={5} id="favoriteSection">
              <h1>Your Favorite List</h1>

              <div id="favoriteAccord">
                <Accordion className="accord">
                  {favoriteItems.map((item, index) => (
                    <div key={favoriteListKey++}>
                      <Accordion.Item eventKey={index} id={index}>
                        <Accordion.Header>
                          {index + 1} <b style={{ paddingLeft: 10 }}>Artist Name: </b>{" "}
                          {item.artistName}
                        </Accordion.Header>
                        <Accordion.Body id="innerAccord">
                          <b style={{ paddingLeft: 50 }}>Track Name:</b>
                          {item.trackName}
                          <br />
                          <b style={{ paddingLeft: 50 }}>Collection Name:</b>{" "}
                          {item.collectionName}
                          <br />
                          <b style={{ paddingLeft: 50 }}>Media Type:</b> {item.kind}
                          <br />
                          <input
                            className="btnClass"
                            id={index}
                            onClick={this.removeFromFavorites}
                            type="button"
                            value="remove item"
                          ></input>
                        </Accordion.Body>
                      </Accordion.Item>
                    </div>
                  ))}
                </Accordion>
              </div>
            </Col>

            {/* ========================== Renders the middle section ==================================== */}
            <Col id="searchForm">
              <h1>iTunes</h1>

              <input
                onChange={this.handleChange}
                type="text"
                placeholder="search term"
              ></input>

              <br />
              <select id="typeSelect">
                <option value="">All</option>
                <option value="movie">Movie</option>
                <option value="podcast">Podcast</option>
                <option value="song">Music</option>
                <option value="audiobook">Audiobook</option>
                <option value="shortFilm">Short Film</option>
                <option value="tvShow">TV Show</option>
                <option value="software">Software</option>
                <option value="ebook">Ebook</option>
                <option value="musicVideo">Music Video</option>
              </select>

              <br />
              <input
                id="searchBtnInput"
                onClick={this.backEndGet}
                type="button"
                value="Search"
              ></input>
            </Col>

            {/* ========================== Renders the search result ==================================== */}
            <Col xs={5} id="searchSection">
              <h1>Search Results</h1>

              <div id="searchAccord">
                <Accordion className="accord">
                  {backEndItems.map((item, index) => (
                    <div key={searchResultKey++}>
                      <Accordion.Item eventKey={index} id={index}>
                        <Accordion.Header id="accordHead">
                          {index + 1}
                          <b style={{ paddingLeft: 10 }}>Artist Name: </b>{" "}
                          {item.artistName}
                        </Accordion.Header>
                        <Accordion.Body>
                          <b style={{ paddingLeft: 50 }}>Track Name:</b> {item.trackName}
                          <br />
                          <b style={{ paddingLeft: 50 }}>Collection Name:</b>{" "}
                          {item.collectionName}
                          <br />
                          <b style={{ paddingLeft: 50 }}>Media Type:</b> {item.kind}
                          <br />
                          <input
                            className="btnClass"
                            onClick={this.addToFavorites}
                            id={index}
                            type="button"
                            value={`Add to favorites`}
                          ></input>
                        </Accordion.Body>
                      </Accordion.Item>
                    </div>
                  ))}
                </Accordion>
              </div>
            </Col>
          </Row>
        </Container>
      );
    }
  }
}

export default ApiComponent;
