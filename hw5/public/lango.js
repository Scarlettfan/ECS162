// An element to go into the DOM
var lango = React.createElement(
  "h1",
  { id: "logo" },
  "Lango!"
);

// A component - function that returns some elements
function FirstCard() {
  return React.createElement(
    "div",
    { className: "chinese" },
    React.createElement(
      "p",
      null,
      "Hello, world!"
    )
  );
}

// Another component
function FirstInputCard() {
  return React.createElement(
    "div",
    { id: "english" },
    React.createElement("textarea", { id: "userInputs", onKeyPress: Checkcharcode })
  );
}

function Savecard() {
  return React.createElement(
    "div",
    { id: "saveFunc" },
    React.createElement(
      "button",
      null,
      "save"
    )
  );
}
// An element with some contents, including a variable
// that has to be evaluated to get an element, and some
// functions that have to be run to get elements.
var main = React.createElement(
  "main",
  null,
  lango,
  React.createElement(FirstInputCard, null),
  React.createElement(FirstCard, null),
  React.createElement(Savecard, null)
);

ReactDOM.render(main, document.getElementById("root"));

// onKeyPress function for the textarea element
// When the charCode is 13, the user has hit the return key
function Checkcharcode(event) {
  console.log(event.charCode);
  if (event.charCode === 13) {
    makeAJAXRequest();
 }
}