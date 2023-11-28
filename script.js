// 💛 💜

const API = `https://api.chucknorris.io/jokes`;

const jokeForm = document.querySelector("#jokeFrom");
const jokeCategories = document.querySelector("#jokeCategories");
const jokeSearch = document.querySelector("#jokeSearch");
const jokesContainer = document.querySelector("#jokesContainer");
const jokesFavContainer = document.querySelector("#jokesFavContainer");
const jokeTypes = document.querySelectorAll('input[name="jokeType"]');

if (jokeForm) {
  jokeForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const jokeType = e.target.querySelector(
      'input[name="jokeType"]:checked'
    ).value;

    let path;
    switch (jokeType) {
      case "random":
        path = "/random";
        break;
      case "categories":
        const category = document.querySelector(
          'input[name="jokeCategory"]:checked'
        ).value;
        path = `/random?category=${category}`;
        break;
      case "seacrh":
        path = `/search?query=${jokeSearch.value}`;
        break;
    }

    try {
      const requestJoke = await fetch(API + path);
      if (!requestJoke.ok) throw new Error(requestJoke.status);
      const responseJoke = await requestJoke.json();
      //   console.log(`status: ${requestJoke.status}`);
      console.log(`joke: ${responseJoke.value}`);
      //   console.dir(responseJoke);

      if (responseJoke.result) {
        responseJoke.result.forEach((joke) => renderJoke(joke));
      } else renderJoke(responseJoke);
    } catch (status) {
      console.log(status);
    }
  });
}

const renderJoke = (joke) => {
  const jokeBlock = document.createElement("div");
  jokeBlock.dataset.id = `joke_${joke.id}`;
  jokeBlock.className = "joke__block";

  const jokeFavBtn = document.createElement("button");
  jokeFavBtn.className = "joke__fav__button";
  jokeFavBtn.innerHTML = joke.favourite ? "💜" : "💛";
  jokeFavBtn.addEventListener("click", (e) => {
    let storageFavJokes = localStorage.getItem("storageFavJokes");
    if (storageFavJokes) storageFavJokes = JSON.parse(storageFavJokes);
    else storageFavJokes = [];

    if (joke.favourite) {
      joke.favourite = false;

      const jokeStorageIndex = storageFavJokes.findIndex(
        (item) => item.id === joke.id
      );
      storageFavJokes.splice(jokeStorageIndex, 1);
      localStorage.setItem("storageFavJokes", JSON.stringify(storageFavJokes));

      const jokeInFavContainer = jokesFavContainer.querySelector(
        `.joke__block[data-id="joke_${joke.id}"]`
      );
      jokeInFavContainer.remove();

      const jokeInContainer = jokesContainer.querySelector(
        `.joke__block[data-id="${joke.id}"]`
      );
      if (jokeInContainer) {
        const jokeInContainerFavBtn =
          jokeInContainer.querySelector(`.joke__fav__button`);
        jokeInContainerFavBtn.innerHTML = "💛";
      } // Менять сердечко на кнопке не завивимо в контейнере она или нет.
    } else {
      joke.favourite = true;
      storageFavJokes.push(joke);
      localStorage.setItem("storageFavJokes", JSON.stringify(storageFavJokes));
      jokeFavBtn.innerHTML = "💜";
      renderJoke(joke);
    }
  });
  jokeBlock.append(jokeFavBtn);

  const jokeBlockValue = document.createElement("p");
  jokeBlockValue.innerHTML = joke.value;
  jokeBlock.append(jokeBlockValue);

  if (joke.categories.length) {
    const categories = document.createElement("p");
    categories.innerHTML = `<b>Categories</b>: ${joke.categories.join(", ")}`;
    jokeBlock.append(categories);
  }

  joke.favourite
    ? jokesFavContainer.append(jokeBlock)
    : jokesContainer.append(jokeBlock);
};
