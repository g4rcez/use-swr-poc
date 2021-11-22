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
  const url = HttpClient.useUrlState(`https://restcountries.com/v3.1/all`);
  const response = useSWR<Country[]>(url.href, HttpClient.fetcher);

  if (response.isValidating) {
    return <h1>Loading...</h1>;
  }

  if (response.error) {
    return <h1 style={{ color: "red" }}>{JSON.stringify(response.error)}</h1>;
  }

  return (
    <div className="App">
      <header className="App-header">
        <div>
          <button
            onClick={() =>
              url.setWindowQueryString({ a: 1, b: 2, random: Math.random() })
            }
          >
            Querify {`{a:1,b:2}`}
          </button>
        </div>
        <pre>
          <code>{JSON.stringify(url, null, 4)}</code>
        </pre>
        {/* <ul>
          {response.data?.map((x) => (
            <li key={x.name.official}>{x.name.official}</li>
          ))}
        </ul> */}
      </header>
    </div>
  );
}

export default App;
