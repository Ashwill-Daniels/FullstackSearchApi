// The first two test functions tests the back-end fetch
// This third test function tests the 3rd party fetch
test("the data is defined", () => {
  return fetch("http://localhost:8080/")
    .then((result) => result.json())
    .then((data) => expect(data).toBeDefined());
});

test("the data is defined", () => {
  return fetch("http://localhost:8080/favorites")
    .then((result) => result.json())
    .then((data) => expect(data).toBeDefined());
});

test("the fetched data has 'trackName' in it", () => {
  return fetch("https://itunes.apple.com/search?term=u2")
    .then((result) => result.json())
    .then((data) => expect(data).toHaveProperty("resultCount"));
});
