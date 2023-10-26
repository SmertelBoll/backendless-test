import { Link, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import "./App.css";
import { Suspense, lazy, useEffect, useState } from "react";

const json = [
  { id: "dummyTable", title: "Dummy Table", order: 1, path: "tabs/dummyTable.js" },
  { id: "dummyChart", title: "Dummy Chart", order: 2, path: "tabs/dummyChart.js" },
  { id: "dummyList", title: "Dummy List", order: 0, path: "tabs/dummyList.js" },
];

function App() {
  const location = useLocation();
  const navigate = useNavigate();
  const [currentObj, setCurrentObj] = useState(false);

  useEffect(() => {
    json.sort((a, b) => a.order - b.order);

    const idOfPage = location.pathname.slice(1);
    if (!idOfPage) {
      setCurrentObj(json[0]);
      navigate(json[0].id);
    }
  }, []);

  useEffect(() => {
    const idOfPage = location.pathname.slice(1);
    const foundObject = json.find((item) => item.id === idOfPage);
    if (foundObject) {
      setCurrentObj(foundObject);
    }
  }, [location]);

  const getComponent = (path) => {
    const LazyComponent = lazy(() => import(`./${path}`));
    return <LazyComponent />;
  };

  return (
    <div className="app">
      <div className="navigate">
        {json.map((obj) => (
          <Link to={obj.id} key={obj.id}>
            {obj.title}
          </Link>
        ))}
      </div>
      <div className="content">
        <Routes>
          <Route
            path={`/${currentObj.id}`}
            element={<Suspense fallback={<div>Loading...</div>}>{getComponent(currentObj.path)}</Suspense>}
          />

          <Route path="/*" element={<div>Page not found..</div>} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
