import useSWR from "swr";
import "./App.css";
import { HttpClient } from "./http-client";

type Country = {
  name: {
    common: string;
    official: string;
  };
};

function App() {
  const url = HttpClient.useUrl(
    `v3.1/all`,
    undefined,
    "https://restcountries.com/"
  );

  const response = useSWR<Country[]>(url, HttpClient.fetcher);

  if (!response.error && !response.data) {
    return <h1>Loading...</h1>;
  }

  if (response.error) {
    return <h1 style={{ color: "red" }}>{JSON.stringify(response.error)}</h1>;
  }

  return (
    <div className="App">
      <header className="App-header">
        <ul>
          {response.data?.map((x) => (
            <li>{x.name.official}</li>
          ))}
        </ul>
      </header>
    </div>
  );
}

export default App;
