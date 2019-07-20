
// A component - function that returns some elements
function Header() {
  return React.createElement(
    "div",
    { id: "header" },
    React.createElement(
      "div",
      null,
      React.createElement(
        "button",
        { id: "Review" ,onClick: makereviewrequest },
        "Start Review"
      )
    ),
    React.createElement(
      "h1",
      { id: "logo" },
      "Lango!"
    )
  );
}

// Another component
function FirstInputCard() {
  return React.createElement(
    "div",
    { className: "translatePage" },
    React.createElement(
      "div",
      { id: "english" },
      React.createElement("textarea", { id: "userInputs", onKeyPress: Checkcharcode })
    ),
    React.createElement(
      "div",
      { className: "chinese", id: "chinese" },
      React.createElement(
        "p",
        null,
        "Hello, world!"
      )
    )
  );
}

function Savecard() {
  return React.createElement(
    "div",
    { id: "saveFunc" },
    React.createElement(
      "button",
      { id: "save", onClick: makesaverequest },
      "save"
    )
  );
}

function Footer() {
  return React.createElement(
    "footer",
    { id: "myfooter"},
    React.createElement(
      "p",
      null,
      "userID"
    )
  );
}
// An element with some contents, including a variable
// that has to be evaluated to get an element, and some
// functions that have to be run to get elements.
var main = React.createElement(
  "main",
  null,
  React.createElement(Header, null),
  React.createElement(FirstInputCard, null),
  React.createElement(Savecard, null),
  React.createElement(Footer, null)
);

ReactDOM.render(main, document.getElementById("root"));
getUser();

// onKeyPress function for the textarea element
// When the charCode is 13, the user has hit the return key
function Checkcharcode(event) {
  console.log(event.charCode);
  if (event.charCode === 13) {
    makeAJAXRequest();
  }
}

function makesaverequest() {
  makeSaverequest();
}

function makereviewrequest() {
  window.location.href = "http://server162.site:50228/Review.html";
}

function getUser() {
  getuser();
}

