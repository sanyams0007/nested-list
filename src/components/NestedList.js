import React, { useEffect } from "react";
import "./NestedList.css";

const NestedList = () => {
  const [data, setData] = React.useState([]);

  // goes till the deepest children and return needed data only
  const goToDeepestChild = (childs) => {
    const filteredData = childs
      .map(({ type, children, name, selected }) => {
        if (
          type === "sectionheader" ||
          (type === "item" && selected === 1) ||
          selected === 1
        ) {
          if (children.length >= 1 || children) {
            let childData = goToDeepestChild(children);
            return { type, children: childData, name, selected };
          } else return { type, name, selected };
        }
      })
      .filter((item) => item !== undefined);
    return filteredData;
  };

  // helps in creating/structuring dynamic UI according to input size
  const createStructure = (sub_class_name, class_name, menu) => {
    return menu.map(({ children, name }, idx) => {
      return (
        <ul key={name + idx} className={`${class_name}`}>
          <li>
            <input id={`${sub_class_name}`} type="checkbox" hidden />
            <label
              htmlFor={`${sub_class_name}`}
              style={{
                fontWeight: "400",
              }}
            >
              <span className="fas fa-caret-right"></span>
              {name}
            </label>
            {children.length > 0 &&
              createStructure(
                "sub-".concat(sub_class_name),
                "sub-".concat(class_name),
                children
              )}
          </li>
        </ul>
      );
    });
  };

  // runs only ones after component gets loaded and get data from API
  useEffect(() => {
    console.log("running");
    fetch("https://api.npoint.io/93bed93a99df4c91044e")
      .then((res) => res.json())
      .then(({ body }) => body)
      .then(({ Recommendations }) => {
        let arr = Recommendations.map(({ RestaurantName, menu }) => {
          let data = goToDeepestChild(menu);

          return {
            RestaurantName,
            menu: data,
          };
        });
        setData([...arr]);
      })
      .catch((err) => console.log(err));
  }, []);

  //console.log(data);

  return (
    <>
      <h1 className="main-head">NESTED LIST</h1>

      <div className="list-container">
        <ul className="main__list">
          {data.map(({ RestaurantName: name, menu }, idx) => {
            return (
              <li key={name}>
                <input id={`group-${idx + 1}`} type="checkbox" hidden />
                <label htmlFor={`group-${idx + 1}`}>
                  <span className="fas fa-caret-right"></span>
                  {name}
                </label>

                {createStructure(`sub-group-${idx + 1}`, "group-list", menu)}
              </li>
            );
          })}
        </ul>
      </div>
    </>
  );
};

export default NestedList;
