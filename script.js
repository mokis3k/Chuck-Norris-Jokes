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
        `.joke__block[data-id="joke_${joke.id}"]`
      );
      if (jokeInContainer) {
        const jokeInContainerFavBtn =
          jokeInContainer.querySelector(`.joke__fav__button`);
        jokeInContainerFavBtn.innerHTML = "💛";
      }
    } else {
      joke.favourite = true;
      storageFavJokes.push(joke);
      localStorage.setItem("storageFavJokes", JSON.stringify(storageFavJokes));
      jokeFavBtn.innerHTML = "💜";
      renderJoke(joke);
    }
  });
  jokeBlock.append(jokeFavBtn);

  const jokeBlockId = document.createElement("span");
  jokeBlockId.className = "joke__block__id";
  const idLink = document.createElement("a");
  idLink.innerHTML = joke.id;
  idLink.href = `https://api.chucknorris.io/jokes/${joke.id}`;
  idLink.target = "_blank"
  jokeBlockId.innerHTML = "ID: ";
  jokeBlockId.append(idLink)
  jokeBlock.append(jokeBlockId);

  const jokeBlockValue = document.createElement("p");
  jokeBlockValue.innerHTML = joke.value;
  jokeBlock.append(jokeBlockValue);

  if (joke.categories.length) {
    const categories = document.createElement("p");
    categories.className = "joke__block__categories";
    categories.innerHTML = joke.categories
      .map((cat) => cat.charAt(0).toUpperCase() + cat.slice(1))
      .join(", ");
    jokeBlock.append(categories);
  }

  joke.favourite
    ? jokesFavContainer.append(jokeBlock)
    : jokesContainer.append(jokeBlock);
};

const renderCategories = async () => {
  try {
    let requestCategories = await fetch(API + "/categories");
    if (!requestCategories.ok) throw new Error(requestCategories.status);
    let categories = await requestCategories.json();

    let LIs = categories
      .map(
        (cat, index) =>
          `<li class="joke__category">
      <label>
      ${
        cat.charAt(0).toUpperCase() + cat.slice(1)
      } <input type="radio" name="jokeCategory" value="${cat}" ${
            !index ? "checked" : ""
          }>
      </label>
      </li>`
      )
      .join("");
    jokeCategories.innerHTML = LIs;
  } catch (status) {
    console.log(status);
  }
};

renderCategories();

jokeTypes.forEach((input) => {
  input.addEventListener("change", (e) => {
    if (e.target.value === "categories") jokeCategories.classList.add("show");
    else jokeCategories.classList.remove("show");

    if (e.target.value === "search") jokeSearch.classList.add("show");
    else jokeSearch.classList.remove("show");
  });
});

const renderFavJokes = () => {
  let storageFavJokes = localStorage.getItem("storageFavJokes");
  if (storageFavJokes) {
    storageFavJokes = JSON.parse(storageFavJokes);
    storageFavJokes.forEach((joke) => renderJoke(joke));
  }
};

renderFavJokes();
